// Ad-hoc WCAG contrast checker for the color pairings enumerated in README.md's
// "Derived from the table above" section. Not part of the build; run manually with:
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
    accentBlue:   [0, 65, 255],
    accentSky:    [102, 204, 255],
    baseCream:    [255, 255, 153],
    white:        [255, 255, 255],
    lightGray:    [200, 200, 203],
    black:        [0, 0, 0],
};

const RATIO_MUTE = 60;          // base.css line 70
const RATIO_EMPHASIS_ACTIVE = 50; // base.css line 80
const RATIO_PAPER_ACTIVE = 16;    // base.css line 86

// --- Scheme color sets, derived from base.css :root + dark media block ---
// README's --color-emphasis-ink / --color-emphasis-paper map onto base.css's
// --color-emphasis / --color-emphasis-fill (see README "invert" style discussion):
//   light: emphasis-ink = accentBlue (text on paper), emphasis-paper = accentBlue (fill bg, dark-only distinct)
//   dark:  emphasis-ink = accentSky,  emphasis-paper = accentBlue
function buildScheme(name, { ink, paper, emphasisInk, emphasisPaper }) {
    const inkMix = mix(ink, paper, RATIO_MUTE);
    const paperMix = mix(ink, paper, RATIO_PAPER_ACTIVE);
    const emphasisInkMix = mix(emphasisInk, ink, RATIO_EMPHASIS_ACTIVE);
    // emphasis-paper-mix has no direct base.css analogue yet; approximate with the same ratio against ink,
    // mirroring --color-emphasis-active's own formula (mix emphasis value toward ink).
    const emphasisPaperMix = mix(emphasisPaper, ink, RATIO_EMPHASIS_ACTIVE);

    return {
        name,
        ink, paper, inkMix, paperMix,
        emphasisInk, emphasisPaper, emphasisInkMix, emphasisPaperMix,
        highlight: RGB.accentYellow,
        error: RGB.accentRed,
        success: RGB.accentGreen,
    };
}

const schemes = [
    buildScheme('light', {
        ink: RGB.black, paper: RGB.white,
        emphasisInk: RGB.accentBlue, emphasisPaper: RGB.accentBlue,
    }),
    buildScheme('dark', {
        ink: RGB.white, paper: RGB.black,
        emphasisInk: RGB.accentSky, emphasisPaper: RGB.accentBlue,
    }),
];

// --- Pairings to check, taken directly from README's derived table ---
const PAIRINGS = [
    ['ink', 'paper', 7],
    ['ink', 'highlight', 7],
    ['inkMix', 'paper', 7],
    ['inkMix', 'ink', 3],
    ['inkMix', 'highlight', 7],
    ['paper', 'ink', 7],
    ['paper', 'inkMix', 7],
    ['paper', 'emphasisInk', 7],
    ['paper', 'highlight', 7],
    ['paperMix', 'emphasisInkMix', 7],
    ['paperMix', 'paper', 3],
    ['paperMix', 'highlight', 7],
    ['emphasisInk', 'paper', 7],
    ['emphasisInk', 'emphasisPaper', 7],
    ['emphasisInk', 'highlight', 7],
    ['emphasisInkMix', 'paperMix', 7],
    ['emphasisInkMix', 'emphasisInk', 3],
    ['emphasisInkMix', 'highlight', 7],
    ['emphasisPaper', 'ink', 7],
    ['emphasisPaper', 'emphasisInk', 7],
    ['emphasisPaper', 'emphasisPaperMix', 3],
    ['emphasisPaperMix', 'emphasisPaper', 3],
    ['highlight', 'ink', 7],
    ['highlight', 'paper', 7],
    ['highlight', 'emphasisInk', 7],
    ['highlight', 'emphasisInkMix', 7],
    ['highlight', 'inkMix', 7],
    ['highlight', 'paperMix', 7],
    ['success', 'ink', 7],
    ['error', 'paper', 3],
];

function fmt(rgb) {
    return `rgb(${rgb.join(',')})`;
}

for (const scheme of schemes) {
    console.log(`\n=== ${scheme.name} ===`);
    for (const [a, b, required] of PAIRINGS) {
        const ratio = contrastRatio(scheme[a], scheme[b]);
        const pass = ratio >= required;
        const mark = pass ? 'PASS' : 'FAIL';
        console.log(
            `${mark}  ${a} (${fmt(scheme[a])}) vs ${b} (${fmt(scheme[b])})  ` +
            `= ${ratio.toFixed(2)}:1  (need ${required}:1)`
        );
    }
}
