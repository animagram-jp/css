// Checks base.css against README's "Contrast requirements", per [data-color-scheme].
//
// This does NOT duplicate audit.mjs. axe-core resolves a background by walking
// the rendered stacking context, so any element under an absolutely-positioned
// ::before — every control inside [data-sign="rule"] — comes back as
// `incomplete` rather than pass/fail: 309 of 430 elements in index.html, in
// every scheme. Those are checked here instead, from the declared values.
// audit.mjs covers the rendered page; this covers the palette itself.
//
// Values below are transcribed from base.css by hand — keep them in sync.
// Not part of the build; run manually with:
//   docker run --rm -v "$PWD":/w -w /w node:lts-slim node contrast-check.mjs

function relativeLuminance([r, g, b]) {
    const toLinear = (c) => {
        c /= 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    const [rl, gl, bl] = [r, g, b].map(toLinear);
    return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

function contrastRatio(rgbA, rgbB) {
    const la = relativeLuminance(rgbA);
    const lb = relativeLuminance(rgbB);
    const [lighter, darker] = la >= lb ? [la, lb] : [lb, la];
    return (lighter + 0.05) / (darker + 0.05);
}

function mix(rgbA, rgbB, percentA) {
    const p = percentA / 100;
    return [0, 1, 2].map((i) => Math.round(rgbA[i] * p + rgbB[i] * (1 - p)));
}

// --- RGB channels, from base.css :root (lines 33-56) ---
const RGB = {
    accentRed:    [255, 40, 0],
    accentYellow: [250, 245, 0],
    accentGreen:  [53, 161, 107],
    accentPurple: [154, 0, 121],
    baseCream:    [255, 255, 153],
    white:        [255, 255, 255],
    lightGray:    [200, 200, 203],
    black:        [0, 0, 0],
};

const THEME_INK_LIGHT = RGB.accentPurple;
const THEME_INK_DARK = mix(RGB.accentPurple, RGB.white, 35);
const THEME_PAPER_LIGHT = mix(RGB.accentPurple, RGB.black, 46);
const THEME_PAPER_DARK = mix(RGB.accentPurple, RGB.white, 71);

const VISITED_LIGHT = mix(RGB.accentPurple, RGB.black, 74);
const VISITED_DARK = mix(RGB.accentPurple, RGB.white, 19);

const SUCCESS = mix(RGB.accentGreen, RGB.black, 78);
const HIGHLIGHT_INK_LIGHT = mix(RGB.accentYellow, RGB.black, 46);
const HIGHLIGHT_PAPER_LIGHT = RGB.accentYellow;
const HIGHLIGHT_INK_DARK = RGB.accentYellow;
const HIGHLIGHT_PAPER_DARK = mix(RGB.accentYellow, RGB.black, 41);

// --- Scheme color sets, one per base.css [data-color-scheme="..."] block ---
function buildScheme(name, { ink, paper, emphasisInk, emphasisPaper, inkMix, paperMix }) {
    const resolvedPaperMix = paperMix ?? mix(ink, paper, 16);
    const emphasisInkMix = mix(emphasisInk, ink, 50);
    const visited = name.startsWith('dark') ? VISITED_DARK : VISITED_LIGHT;

    return {
        name,
        ink, paper, inkMix, paperMix: resolvedPaperMix,
        emphasisInk, emphasisPaper, emphasisInkMix,
        highlightInk: paper,
        highlightPaper: ink,
        highlightVarInk: name.startsWith('dark') ? HIGHLIGHT_INK_DARK : HIGHLIGHT_INK_LIGHT,
        highlightVarPaper: name.startsWith('dark') ? HIGHLIGHT_PAPER_DARK : HIGHLIGHT_PAPER_LIGHT,
        error: RGB.accentRed,
        success: SUCCESS,
        visited,
    };
}

const schemes = [
    buildScheme('light', {
        ink: RGB.black, paper: RGB.white,
        emphasisInk: THEME_INK_LIGHT, emphasisPaper: THEME_PAPER_LIGHT,
        inkMix: [102, 102, 102], // color-mix(in srgb, ink 60%, paper)
    }),
    buildScheme('dark', {
        ink: RGB.white, paper: RGB.black,
        emphasisInk: THEME_INK_DARK, emphasisPaper: THEME_PAPER_DARK,
        inkMix: [153, 153, 153], // color-mix(in srgb, ink 60%, paper)
    }),
    buildScheme('light-high-contrast', {
        ink: RGB.black, paper: RGB.white,
        emphasisInk: THEME_INK_LIGHT, emphasisPaper: THEME_PAPER_LIGHT,
        inkMix: [87, 87, 87], // color-mix(in srgb, ink 66%, paper)
    }),
    buildScheme('dark-high-contrast', {
        ink: RGB.white, paper: RGB.black,
        emphasisInk: THEME_INK_DARK, emphasisPaper: THEME_PAPER_DARK,
        inkMix: [168, 168, 168], // color-mix(in srgb, ink 66%, paper)
    }),
    buildScheme('light-less-contrast', {
        ink: [43, 43, 43], paper: [243, 243, 243],
        emphasisInk: THEME_INK_LIGHT, emphasisPaper: THEME_PAPER_LIGHT,
        inkMix: [43, 43, 43], paperMix: [243, 243, 243],
    }),
    buildScheme('dark-less-contrast', {
        ink: [243, 243, 243], paper: [43, 43, 43],
        emphasisInk: THEME_INK_DARK, emphasisPaper: THEME_PAPER_DARK,
        inkMix: [243, 243, 243], paperMix: [43, 43, 43],
    }),
];

// --- Pairings to check, taken directly from README's "Contrast requirements" table ---
const PAIRINGS = [
    ['ink', 'paperMix', 4.5],
    ['inkMix', 'paper', 4.5],
    ['inkMix', 'paperMix', 3],
    ['paperMix', 'emphasisInkMix', 7],
    ['highlightVarInk', 'highlightInk', 4.5],
    ['highlightVarPaper', 'highlightPaper', 4.5],
    ['highlightVarPaper', 'emphasisInk', 3],
    ['highlightVarPaper', 'emphasisInkMix', 3],
    ['highlightVarInk', 'paper', 3],
    ['highlightVarInk', 'paperMix', 3],

    ['emphasisInk', 'paper', 7],
    ['emphasisInkMix', 'paper', 7],
    ['emphasisPaper', 'paper', 3],
    ['error', 'paper', 3],
    ['visited', 'paper', 7],
];

const PAIRINGS_LIGHT_ONLY = [
    ['paper', 'emphasisInk', 7],
    ['paper', 'emphasisInkMix', 7],
    ['paper', 'inkMix', 4.5],
    ['paper', 'error', 3],
    ['success', 'paper', 4.5],
];
const PAIRINGS_DARK_ONLY = [
    ['ink', 'paper', 7],
    ['ink', 'success', 4.5],
    ['paper', 'emphasisInk', 7],
    ['paper', 'emphasisInkMix', 7],
    ['paper', 'ink', 7],
    ['paper', 'inkMix', 4.5],
    ['paper', 'error', 3],
];

function fmt(rgb) {
    return `rgb(${rgb.join(',')})`;
}

for (const scheme of schemes) {
    console.log(`\n=== ${scheme.name} ===`);
    const schemePairings = [
        ...PAIRINGS,
        ...(scheme.name.startsWith('light') ? PAIRINGS_LIGHT_ONLY : PAIRINGS_DARK_ONLY),
    ];
    const exempt = false;
    for (const [a, b, required] of schemePairings) {
        const ratio = contrastRatio(scheme[a], scheme[b]);
        const pass = ratio >= required;
        const mark = pass ? 'PASS' : (exempt && required > 3 ? 'EXEMPT' : 'TODO');
        console.log(
            `${mark}  ${a} (${fmt(scheme[a])}) vs ${b} (${fmt(scheme[b])})  ` +
            `= ${ratio.toFixed(2)}:1  (need ${required}:1)`
        );
    }
}
