// Ad-hoc WCAG contrast checker for the color pairings enumerated in README.md's
// "Contrast requirements" table, checked independently per base.css [data-color-scheme].
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

// Theme purple (#5B2F91), mirroring base.css's --color-emphasis-ink/--color-emphasis-paper
// color-mix(in srgb, rgb(91,47,145) N%, rgb(255,255,255)) formulas
const THEME_INK_LIGHT = [91, 47, 145];         // theme color as-is
const THEME_INK_DARK = mix([91, 47, 145], RGB.white, 50);
const THEME_PAPER = mix([91, 47, 145], RGB.white, 73); // shared by every scheme

// color:visited, mirroring button.css's dark-mode color-mix(in srgb, rgb(var(--rgb-accent-purple)) 35%, rgb(255,255,255))
const VISITED_DARK = mix(RGB.accentPurple, RGB.white, 35);

// --color-success/--color-highlight, mirroring base.css's color-mix(in srgb, rgb(var(--rgb-accent-*)) N%, rgb(0,0,0))
const SUCCESS = mix(RGB.accentGreen, RGB.black, 78);
const HIGHLIGHT = mix(RGB.accentYellow, RGB.black, 49);

// --- Scheme color sets, one per base.css [data-color-scheme="..."] block ---
// ink/paper/emphasisInk/emphasisPaper/inkMix/paperMix mirror the literal values
// each scheme block sets in base.css (css/base.css). paperMix/emphasisInkMix
// default to the single :root formula unless a scheme overrides them (e.g. *-less-contrast).
// emphasisPaper has no -mix variant: invert uses emphasisInk/emphasisInkMix in both light and
// dark now, so emphasisPaper only ever appears as a flat fill (e.g. a selected table row / radio dot).
function buildScheme(name, { ink, paper, emphasisInk, emphasisPaper, inkMix, paperMix }) {
    const resolvedPaperMix = paperMix ?? mix(ink, paper, 16);
    const emphasisInkMix = mix(emphasisInk, ink, 50);
    // color:visited only switches under prefers-color-scheme: dark (button.css), not prefers-contrast,
    // so *-high-contrast/*-less-contrast schemes use whichever value their "light"/"dark" half implies.
    const visited = name.startsWith('dark') ? VISITED_DARK : RGB.accentPurple;

    return {
        name,
        ink, paper, inkMix, paperMix: resolvedPaperMix,
        emphasisInk, emphasisPaper, emphasisInkMix,
        highlight: HIGHLIGHT,
        error: RGB.accentRed,
        success: SUCCESS,
        visited,
    };
}

const schemes = [
    buildScheme('light', {
        ink: RGB.black, paper: RGB.white,
        emphasisInk: THEME_INK_LIGHT, emphasisPaper: THEME_PAPER,
        inkMix: [102, 102, 102], // color-mix(in srgb, ink 60%, paper)
    }),
    buildScheme('dark', {
        ink: RGB.white, paper: RGB.black,
        emphasisInk: THEME_INK_DARK, emphasisPaper: THEME_PAPER,
        inkMix: [153, 153, 153], // color-mix(in srgb, ink 60%, paper)
    }),
    buildScheme('light-high-contrast', {
        ink: RGB.black, paper: RGB.white,
        emphasisInk: THEME_INK_LIGHT, emphasisPaper: THEME_PAPER,
        inkMix: [87, 87, 87], // color-mix(in srgb, ink 66%, paper)
    }),
    buildScheme('dark-high-contrast', {
        ink: RGB.white, paper: RGB.black,
        emphasisInk: THEME_INK_DARK, emphasisPaper: THEME_PAPER,
        inkMix: [168, 168, 168], // color-mix(in srgb, ink 66%, paper)
    }),
    buildScheme('light-less-contrast', {
        ink: [36, 36, 36], paper: [246, 246, 246],
        emphasisInk: THEME_INK_LIGHT, emphasisPaper: THEME_PAPER,
        // this scheme's 13.5:1 span leaves no room for a distinct -mix shade; collapse onto the base color.
        inkMix: [36, 36, 36], paperMix: [246, 246, 246],
    }),
    buildScheme('dark-less-contrast', {
        ink: [246, 246, 246], paper: [36, 36, 36],
        emphasisInk: THEME_INK_DARK, emphasisPaper: THEME_PAPER,
        inkMix: [246, 246, 246], paperMix: [36, 36, 36],
    }),
];

// --- Pairings to check, taken directly from README's "Contrast requirements" table ---
// One row per table cell; each pairing listed once (order as in the table's own row).
// Rows without a (light)/(dark) suffix in README hold in every scheme, so they live here.
const PAIRINGS = [
    // --color-ink: 4.5:1 -> highlight (its own inner ::selection text, always --color-ink now)
    ['ink', 'highlight', 4.5],
    // --color-ink-mix: 4.5:1 -> paper / 3:1 -> highlight
    ['inkMix', 'paper', 4.5],
    ['inkMix', 'highlight', 3],
    // --color-paper: 3:1 -> highlight (the outer fill --color-highlight sits on)
    ['paper', 'highlight', 3],
    // --color-paper-mix: 7:1 -> emphasis-ink-mix / 3:1 -> highlight
    ['paperMix', 'emphasisInkMix', 7],
    ['paperMix', 'highlight', 3],
    // --color-highlight: 3:1 -> emphasis-ink, emphasis-ink-mix, ink-mix (other outer fills it can sit on)
    ['highlight', 'emphasisInk', 3],
    ['highlight', 'emphasisInkMix', 3],
    // --color-emphasis-ink: 7:1 -> paper (invert:active's border is transparent, not emphasis-ink,
    // since a color dark enough to clear 7:1 vs paper can't also clear 3:1 vs its own -mix variant)
    ['emphasisInk', 'paper', 7],
    // --color-emphasis-ink-mix: 7:1 -> paper / 3:1 -> highlight
    ['emphasisInkMix', 'paper', 7],
    ['emphasisInkMix', 'highlight', 3],
    // --color-emphasis-paper: 3:1 -> paper (invert no longer uses it; its one remaining use,
    // a flat fill like a selected table row / radio dot, never carries text)
    ['emphasisPaper', 'paper', 3],
    // --color-error: 3:1 -> paper (error is only ever a border/outline color; it never neighbors the highlight nested inside a fill)
    ['error', 'paper', 3],
    // color:visited: 7:1 against --color-paper (per its own definition, README.md's Contrast requirements table)
    ['visited', 'paper', 7],
];

// --color-highlight's own ::selection text is always --color-ink now (no dark-mode swap to
// --color-paper), so its ink/paper relationships hold in every scheme and live in PAIRINGS above.
const PAIRINGS_LIGHT_ONLY = [
    // --color-paper (light): 7:1 -> emphasis-ink, emphasis-ink-mix / 4.5:1 -> ink-mix / 3:1 -> error
    ['paper', 'emphasisInk', 7],
    ['paper', 'emphasisInkMix', 7],
    ['paper', 'inkMix', 4.5],
    ['paper', 'error', 3],
    // --color-success (light): 4.5:1 against --color-paper (README.md's Contrast requirements table)
    ['success', 'paper', 4.5],
];
const PAIRINGS_DARK_ONLY = [
    // --color-ink (dark): 7:1 -> paper / 4.5:1 -> success
    ['ink', 'paper', 7],
    ['ink', 'success', 4.5],
    // --color-paper (dark): 7:1 -> emphasis-ink, emphasis-ink-mix, ink / 4.5:1 -> ink-mix / 3:1 -> error
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
    for (const [a, b, required] of schemePairings) {
        const ratio = contrastRatio(scheme[a], scheme[b]);
        const pass = ratio >= required;
        const mark = pass ? 'PASS' : 'FAIL';
        console.log(
            `${mark}  ${a} (${fmt(scheme[a])}) vs ${b} (${fmt(scheme[b])})  ` +
            `= ${ratio.toFixed(2)}:1  (need ${required}:1)`
        );
    }
}
