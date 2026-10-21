// docker run --rm -v "$PWD":/w -w /w node:lts-slim node solve_palette.mjs

function relative_luminance([r,g,b]){const f=c=>{c/=255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4)};const[a,b2,c2]=[r,g,b].map(f);return 0.2126*a+0.7152*b2+0.0722*c2}
function contrast_ratio(A,B){const a=relative_luminance(A),b=relative_luminance(B);const[h,l]=a>=b?[a,b]:[b,a];return (h+0.05)/(l+0.05)}
function mix(A,B,p){p/=100;return[0,1,2].map(i=>Math.round(A[i]*p+B[i]*(1-p)))}

// --- channels ---
const CHANNEL={
  accent_red:[255,40,0], accent_yellow:[250,245,0], accent_green:[53,161,107],
  accent_blue:[0,65,255], accent_purple:[154,0,121], base_light_purple:[199,178,222],
  white:[255,255,255], black:[0,0,0],
};

const argument_hex=(process.argv[2]||"").replace(/^#/,"");
const EMPHASIS_SOURCE = /^[0-9a-fA-F]{6}$/.test(argument_hex)
  ? [0,2,4].map(i=>parseInt(argument_hex.slice(i,i+2),16))
  : CHANNEL.accent_purple;
const EMPHASIS_NAME = /^[0-9a-fA-F]{6}$/.test(argument_hex) ? `#${argument_hex.toUpperCase()}` : "accent-purple";

// --- Scheme ink/paper. more-contrast is the sRGB maximum; less-contrast the derived threshold. ---
const FAMILY={
  light:{
    "light":               {ink:CHANNEL.black, paper:CHANNEL.white,  ink_mix_percent:60},
    "light-more-contrast": {ink:CHANNEL.black, paper:CHANNEL.white,  ink_mix_percent:66},
    "light-less-contrast": {ink:[43,43,43], paper:[243,243,243],     collapse_mix:true},
  },
  dark:{
    "dark":               {ink:CHANNEL.white, paper:CHANNEL.black,   ink_mix_percent:60},
    "dark-more-contrast": {ink:CHANNEL.white, paper:CHANNEL.black,   ink_mix_percent:66},
    "dark-less-contrast": {ink:[243,243,243], paper:[43,43,43],      collapse_mix:true},
  },
};
let scheme_set=FAMILY.light;

// README "Distinctness".
const DISTINCT_EMPHASIS_PAPER = 2;

function rgb_to_oklch(rgb){
  const [r,g,b]=rgb.map(c=>{c/=255;return c<=0.04045?c/12.92:Math.pow((c+0.055)/1.055,2.4)});
  const l=Math.cbrt(0.4122214708*r+0.5363325363*g+0.0514459929*b);
  const m=Math.cbrt(0.2119034982*r+0.6806995451*g+0.1073969566*b);
  const s=Math.cbrt(0.0883024619*r+0.2817188376*g+0.6299787005*b);
  const lab_a=1.9779984951*l-2.4285922050*m+0.4505937099*s;
  const lab_b=0.0259040371*l+0.7827717662*m-0.8086757660*s;
  return [0.2104542553*l+0.7936177850*m-0.0040720468*s, Math.hypot(lab_a,lab_b), (Math.atan2(lab_b,lab_a)*180/Math.PI+360)%360];
}
function oklch_to_rgb(lightness,chroma,hue){
  const a=chroma*Math.cos(hue*Math.PI/180), b=chroma*Math.sin(hue*Math.PI/180);
  const l=(lightness+0.3963377774*a+0.2158037573*b)**3;
  const m=(lightness-0.1055613458*a-0.0638541728*b)**3;
  const s=(lightness-0.0894841775*a-1.2914855480*b)**3;
  const linear=[4.0767416621*l-3.3077115913*m+0.2309699292*s, -1.2684380046*l+2.6097574011*m-0.3413193965*s, -0.0041960863*l-0.7034186147*m+1.7076147010*s];
  if(linear.some(v=>v<-1e-7||v>1+1e-7)) return null;
  return linear.map(v=>{v=Math.min(1,Math.max(0,v));return Math.round((v<=0.0031308?12.92*v:1.055*Math.pow(v,1/2.4)-0.055)*255)});
}

const GRID=new Map();
function grid_for(hue){
  if(!GRID.has(hue)){
    const grid=[];
    for(let i=0;i<=1000;i++) for(let j=0;j<=400;j++){ const rgb=oklch_to_rgb(i/1000,j/1000,hue); if(rgb) grid.push({lightness:i/1000,chroma:j/1000,rgb}); }
    GRID.set(hue,grid);
  }
  return GRID.get(hue);
}

function find_oklch(base, test){
  const [source_lightness,source_chroma,hue]=rgb_to_oklch(base);
  let best=null, best_distance=Infinity;
  for(const point of [{lightness:source_lightness,chroma:source_chroma,rgb:base,exact:true}, ...grid_for(hue)]){
    const distance=(point.lightness-source_lightness)**2+(point.chroma-source_chroma)**2;
    if(distance<best_distance && test(point.rgb)){ best_distance=distance; best=point; }
  }
  return best;
}

function best_oklch(base, must, score){
  const [source_lightness,source_chroma,hue]=rgb_to_oklch(base);
  const candidate=[{lightness:source_lightness,chroma:source_chroma,rgb:base,exact:true}, ...grid_for(hue)]
    .filter(point=>must(point.rgb)).map(point=>({...point,score:score(point.rgb)}));
  const top=Math.max(...candidate.map(point=>point.score));
  let best=null, best_distance=Infinity;
  for(const point of candidate){
    const distance=Math.abs(point.chroma-source_chroma)*1e3+Math.abs(point.lightness-source_lightness);
    if(point.score>=top-0.02 && distance<best_distance){ best_distance=distance; best=point; }
  }
  return best;
}

// Requirements that must hold in EVERY scheme of the family.
function check_all(palette){
  const bad=[];
  for(const [name,scheme] of Object.entries(scheme_set)){
    const ink_mix = scheme.collapse_mix ? scheme.ink : mix(scheme.ink,scheme.paper,scheme.ink_mix_percent);
    const paper_mix = scheme.collapse_mix ? scheme.paper : mix(scheme.ink,scheme.paper,16);
    const emphasis_mix = scheme.collapse_mix ? palette.emphasis_ink : mix(palette.emphasis_ink,scheme.ink,50);
    const rows=[
      ["ink vs paper (7:1)",          scheme.ink,   scheme.paper, 7],
      ["ink-mix vs paper (4.5:1)",    ink_mix,  scheme.paper, 4.5],
      ["paper-mix vs eMix (7:1)",     paper_mix,emphasis_mix,    7],
      ["emphasis-ink vs paper (7:1)", palette.emphasis_ink, scheme.paper, 7],
      ["eMix vs paper (7:1)",         emphasis_mix,    scheme.paper, 7],
      ["emphasis-paper vs paper (3:1)",palette.emphasis_paper,scheme.paper,3],
      ["emphasis-paper vs ink (4.5:1)",palette.emphasis_paper,scheme.ink,4.5],
      ["hl-ink vs its text (4.5:1)",  palette.highlight_ink,  scheme.paper, 4.5],
      ["hl-ink vs paper fill (3:1)",  palette.highlight_ink,  scheme.paper, 3],
      ["hl-ink vs paper-mix (3:1)",   palette.highlight_ink,  paper_mix,3],
      ["hl-paper vs its text (4.5:1)",palette.highlight_paper,scheme.ink,   4.5],
      ["hl-paper vs emphasis-ink (3:1)",palette.highlight_paper,palette.emphasis_ink,3],
      ["hl-paper vs eMix (3:1)",      palette.highlight_paper,emphasis_mix,    3],
      ["success vs paper (3:1)",      palette.success, scheme.paper, 3],
      ["error vs paper (3:1)",        palette.error,   scheme.paper, 3],
      ["visited vs paper (7:1)",      palette.visited, scheme.paper, 7],
    ];
    for(const [row_name,a,b,required] of rows){ const v=contrast_ratio(a,b); if(v<required) bad.push(`${name}: ${row_name} = ${v.toFixed(2)} < ${required}`); }
  }
  return bad;
}

function solve_family(family){
  scheme_set = FAMILY[family];
  const dark = family === "dark";
  const papers = Object.values(scheme_set).map(scheme => scheme.paper);
  const inks   = Object.values(scheme_set).map(scheme => scheme.ink);
  const BIND_PAPER = papers.reduce((a,b)=> (dark ? (relative_luminance(a)>relative_luminance(b)?a:b) : (relative_luminance(a)<relative_luminance(b)?a:b)));
  const BIND_INK   = inks.reduce((a,b)=> (dark ? (relative_luminance(a)<relative_luminance(b)?a:b) : (relative_luminance(a)>relative_luminance(b)?a:b)));

  const palette={};
  palette.emphasis_ink_source = find_oklch(EMPHASIS_SOURCE, c => contrast_ratio(c,BIND_PAPER)>=7);
  palette.emphasis_ink = palette.emphasis_ink_source.rgb;
  const emphasis_paper_must = c => contrast_ratio(c,BIND_INK)>=4.5 && contrast_ratio(c,palette.emphasis_ink)>=DISTINCT_EMPHASIS_PAPER;
  palette.emphasis_paper_source = find_oklch(EMPHASIS_SOURCE, c => contrast_ratio(c,BIND_PAPER)>=3 && emphasis_paper_must(c))
    || best_oklch(EMPHASIS_SOURCE, emphasis_paper_must, c => contrast_ratio(c,BIND_PAPER));
  palette.emphasis_paper = palette.emphasis_paper_source.rgb;
  palette.highlight_ink_source = find_oklch(CHANNEL.accent_yellow, c => contrast_ratio(c,BIND_PAPER)>=4.5);
  palette.highlight_ink = palette.highlight_ink_source.rgb;
  palette.highlight_paper_source = find_oklch(CHANNEL.accent_yellow, c => contrast_ratio(c,BIND_INK)>=4.5 && contrast_ratio(c,palette.emphasis_ink)>=3);
  palette.highlight_paper = palette.highlight_paper_source.rgb;
  palette.success_source = find_oklch(CHANNEL.accent_green, c => contrast_ratio(c,BIND_PAPER)>=3);
  palette.success = palette.success_source.rgb;
  palette.error_source = find_oklch(CHANNEL.accent_red, c => contrast_ratio(c,BIND_PAPER)>=3);
  palette.error = palette.error_source.rgb;
  palette.visited_source = find_oklch(CHANNEL.accent_purple, c => contrast_ratio(c,BIND_PAPER)>=7);
  palette.visited = palette.visited_source.rgb;
  return palette;
}

const CHANNEL_NAME={emphasis_ink:EMPHASIS_NAME,emphasis_paper:EMPHASIS_NAME,highlight_ink:"accent-yellow",
  highlight_paper:"accent-yellow",success:"accent-green",error:"accent-red",visited:"accent-purple"};
console.log(`emphasis source: ${EMPHASIS_NAME} rgb(${EMPHASIS_SOURCE})`);
for(const family of ["light","dark"]){
  const palette=solve_family(family);
  console.log(`\n=== ${family} family ===`);
  for(const key of Object.keys(CHANNEL_NAME)){
    const source=palette[key+"_source"];
    const property_name="--color-"+key.replace(/_/g,"-");
    if(!source){console.log(`${property_name}: NO SOLUTION`);continue}
    const channel = CHANNEL_NAME[key].startsWith("#") ? CHANNEL_NAME[key] : `rgb(var(--rgb-${CHANNEL_NAME[key]}))`;
    const value = source.exact ? channel : `oklch(from ${channel} ${source.lightness.toFixed(3)} ${source.chroma.toFixed(3)} h)`;
    console.log(`${property_name}: ${value};  -> rgb(${source.rgb})`);
  }
  const bad=check_all(palette);
  console.log(bad.length ? bad.map(b=>"  FAIL "+b).join("\n") : "  all rows pass");
}
