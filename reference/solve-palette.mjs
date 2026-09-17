// docker run --rm -v "$PWD":/w -w /w node:lts-slim node solve-palette.mjs

function relLum([r,g,b]){const f=c=>{c/=255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4)};const[a,b2,c2]=[r,g,b].map(f);return 0.2126*a+0.7152*b2+0.0722*c2}
function cr(A,B){const a=relLum(A),b=relLum(B);const[h,l]=a>=b?[a,b]:[b,a];return (h+0.05)/(l+0.05)}
function mix(A,B,p){p/=100;return[0,1,2].map(i=>Math.round(A[i]*p+B[i]*(1-p)))}

// --- channels ---
const CH={
  accentRed:[255,40,0], accentYellow:[250,245,0], accentGreen:[53,161,107],
  accentBlue:[0,65,255], accentPurple:[154,0,121], baseLightPurple:[199,178,222],
  white:[255,255,255], black:[0,0,0],
};

const argHex=(process.argv[2]||'').replace(/^#/,'');
const EMPHASIS_SRC = /^[0-9a-fA-F]{6}$/.test(argHex)
  ? [0,2,4].map(i=>parseInt(argHex.slice(i,i+2),16))
  : CH.accentPurple;
const EMPHASIS_NAME = /^[0-9a-fA-F]{6}$/.test(argHex) ? `#${argHex.toUpperCase()}` : 'accent-purple';

// --- Scheme ink/paper. high-contrast is the sRGB maximum; less-contrast the derived threshold. ---
const FAMILIES={
  light:{
    'light':               {ink:CH.black, paper:CH.white,        inkMixPct:60},
    'light-high-contrast': {ink:CH.black, paper:CH.white,        inkMixPct:66},
    'light-less-contrast': {ink:[43,43,43], paper:[243,243,243], collapseMix:true},
  },
  dark:{
    'dark':               {ink:CH.white, paper:CH.black,         inkMixPct:60},
    'dark-high-contrast': {ink:CH.white, paper:CH.black,         inkMixPct:66},
    'dark-less-contrast': {ink:[243,243,243], paper:[43,43,43],  collapseMix:true},
  },
};
let SCHEMES=FAMILIES.light;

// README "Distinctness (not a WCAG rule)".
const DISTINCT_EMPHASIS_PAPER = 2;
const DISTINCT_VISITED = 1.4;

// Search a color-mix(base, toward, pct) over a channel, returning the first pct meeting `test`.
function findMix(base, toward, test, step=1){
  for(let p=100;p>=0;p-=step){ const c=mix(base,toward,p); if(test(c)) return {pct:p,rgb:c}; }
  return null;
}

// Requirements that must hold in EVERY scheme of the family.
function checkAll(P){
  const bad=[];
  for(const [nm,s] of Object.entries(SCHEMES)){
    const inkMix = s.collapseMix ? s.ink : mix(s.ink,s.paper,s.inkMixPct);
    const paperMix = s.collapseMix ? s.paper : mix(s.ink,s.paper,16);
    const eMix = s.collapseMix ? P.emphasisInk : mix(P.emphasisInk,s.ink,50);
    const rows=[
      ['ink vs paper (7:1)',          s.ink,   s.paper, 7],
      ['ink-mix vs paper (4.5:1)',    inkMix,  s.paper, 4.5],
      ['paper-mix vs eMix (7:1)',     paperMix,eMix,    7],
      ['emphasis-ink vs paper (7:1)', P.emphasisInk, s.paper, 7],
      ['eMix vs paper (7:1)',         eMix,    s.paper, 7],
      ['emphasis-paper vs paper (3:1)',P.emphasisPaper,s.paper,3],
      ['hl-ink vs its text (4.5:1)',  P.highlightInk,  s.paper, 4.5],
      ['hl-ink vs paper fill (3:1)',  P.highlightInk,  s.paper, 3],
      ['hl-ink vs paper-mix (3:1)',   P.highlightInk,  paperMix,3],
      ['hl-paper vs its text (4.5:1)',P.highlightPaper,s.ink,   4.5],
      ['hl-paper vs emphasis-ink (3:1)',P.highlightPaper,P.emphasisInk,3],
      ['hl-paper vs eMix (3:1)',      P.highlightPaper,eMix,    3],
      ['success vs paper (4.5:1)',    P.success, s.paper, 4.5],
      ['error vs paper (3:1)',        P.error,   s.paper, 3],
      ['visited vs paper (7:1)',      P.visited, s.paper, 7],
    ];
    for(const [n,a,b,req] of rows){ const v=cr(a,b); if(v<req) bad.push(`${nm}: ${n} = ${v.toFixed(2)} < ${req}`); }
  }
  return bad;
}

function solveFamily(fam){
  SCHEMES = FAMILIES[fam];
  const dark = fam === 'dark';
  const AWAY = dark ? CH.white : CH.black;   // direction that increases contrast against paper
  const TOWARD = dark ? CH.black : CH.white; // the opposite end
  const papers = Object.values(SCHEMES).map(s => s.paper);
  const inks   = Object.values(SCHEMES).map(s => s.ink);
  const BIND_PAPER = papers.reduce((a,b)=> (dark ? (relLum(a)>relLum(b)?a:b) : (relLum(a)<relLum(b)?a:b)));
  const BIND_INK   = inks.reduce((a,b)=> (dark ? (relLum(a)<relLum(b)?a:b) : (relLum(a)>relLum(b)?a:b)));

  const P={};
  P.emphasisInkSrc = findMix(EMPHASIS_SRC, AWAY, c => cr(c,BIND_PAPER)>=7);
  P.emphasisInk = P.emphasisInkSrc.rgb;
  P.emphasisPaperSrc = findMix(EMPHASIS_SRC, AWAY,
      c => cr(c,BIND_PAPER)>=3 && cr(c,P.emphasisInk)>=DISTINCT_EMPHASIS_PAPER)
    || findMix(EMPHASIS_SRC, TOWARD,
      c => cr(c,BIND_PAPER)>=3 && cr(c,P.emphasisInk)>=DISTINCT_EMPHASIS_PAPER);
  P.emphasisPaper = P.emphasisPaperSrc.rgb;
  P.highlightInkSrc = findMix(CH.accentYellow, AWAY, c => cr(c,BIND_PAPER)>=4.5);
  P.highlightInk = P.highlightInkSrc.rgb;
  P.highlightPaperSrc = findMix(CH.accentYellow, TOWARD,
    c => cr(c,BIND_INK)>=4.5 && cr(c,P.emphasisInk)>=3);
  P.highlightPaper = P.highlightPaperSrc.rgb;
  P.successSrc = findMix(CH.accentGreen, AWAY, c => cr(c,BIND_PAPER)>=4.5);
  P.success = P.successSrc.rgb;
  P.errorSrc = findMix(CH.accentRed, AWAY, c => cr(c,BIND_PAPER)>=3);
  P.error = P.errorSrc.rgb;
  P.visitedSrc = findMix(EMPHASIS_SRC, AWAY,
      c => cr(c,BIND_PAPER)>=7 && cr(c,P.emphasisInk)>=DISTINCT_VISITED)
    || findMix(EMPHASIS_SRC, TOWARD,
      c => cr(c,BIND_PAPER)>=7 && cr(c,P.emphasisInk)>=DISTINCT_VISITED);
  P.visited = P.visitedSrc.rgb;
  return {P, AWAY, TOWARD};
}

const CHNAME={emphasisInk:EMPHASIS_NAME,emphasisPaper:EMPHASIS_NAME,highlightInk:'accent-yellow',
  highlightPaper:'accent-yellow',success:'accent-green',error:'accent-red',visited:EMPHASIS_NAME};
const AWAY_KEYS=new Set(['emphasisInk','emphasisPaper','highlightInk','success','error','visited']);

console.log(`emphasis source: ${EMPHASIS_NAME} rgb(${EMPHASIS_SRC})`);
for(const fam of ['light','dark']){
  const {P,AWAY,TOWARD}=solveFamily(fam);
  console.log(`\n=== ${fam} family ===`);
  for(const k of Object.keys(CHNAME)){
    const src=P[k+'Src'];
    if(!src){console.log(`--color-${k}: NO SOLUTION`);continue}
    const end = AWAY_KEYS.has(k) ? AWAY : TOWARD;
    const endName = end===CH.black ? 'rgb(0,0,0)' : 'rgb(255,255,255)';
    const varName='--color-'+k.replace(/[A-Z]/g,m=>'-'+m.toLowerCase());
    const chan = CHNAME[k].startsWith('#') ? CHNAME[k] : `rgb(var(--rgb-${CHNAME[k]}))`;
    console.log(`${varName}: color-mix(in srgb, ${chan} ${src.pct}%, ${endName});  -> rgb(${src.rgb})`);
  }
  const bad=checkAll(P);
  console.log(bad.length ? bad.map(b=>'  FAIL '+b).join('\n') : '  all rows pass');
}
