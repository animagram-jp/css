// --- channels ---
export const CHANNEL = {
    accent_red: [255, 40, 0],
    accent_yellow: [250, 245, 0],
    accent_green: [53, 161, 107],
    accent_blue: [0, 65, 255],
    accent_purple: [154, 0, 121],
    base_light_purple: [199, 178, 222],
    white: [255, 255, 255],
    black: [0, 0, 0],
};

export const FIXED_SOURCE = {
    highlight: CHANNEL.accent_yellow,
    success: CHANNEL.accent_green,
    error: CHANNEL.accent_red,
    visited: CHANNEL.accent_purple,
};

// --- Scheme ink/paper. more-contrast is the sRGB maximum; less-contrast the derived threshold. ---
export const FAMILY = {
    light: {
        "light": { ink: CHANNEL.black, paper: CHANNEL.white, ink_mix_percent: 60 },
        "light-more-contrast": { ink: CHANNEL.black, paper: CHANNEL.white, ink_mix_percent: 66 },
        "light-less-contrast": { ink: [43, 43, 43], paper: [243, 243, 243], collapse_mix: true },
    },
    dark: {
        "dark": { ink: CHANNEL.white, paper: CHANNEL.black, ink_mix_percent: 60 },
        "dark-more-contrast": { ink: CHANNEL.white, paper: CHANNEL.black, ink_mix_percent: 66 },
        "dark-less-contrast": { ink: [243, 243, 243], paper: [43, 43, 43], collapse_mix: true },
    },
};

export const SOURCE_LIGHTNESS = 0.65;

const CONTRAST_ENHANCED = 7;
const CONTRAST_MINIMUM = 4.5;
const CONTRAST_GRAPHICAL = 3;

// README "Distinctness".
const EMPHASIS_DISTINCTNESS = 2;

const PAPER_MIX_PERCENT = 16;
const EMPHASIS_MIX_PERCENT = 50;

const GRID_RESOLUTION = 1000;
const GRID_CHROMA_MAXIMUM = 0.4;
const GAMUT_TOLERANCE = 1e-7;
const SCORE_TOLERANCE = 0.02;
const CHROMA_WEIGHT = 1000;
const SOURCE_CHROMA_STEP = 0.002;

export function calculate_relative_luminance(rgb) {
    const [red, green, blue] = rgb.map((channel) => {
        const unit = channel / 255;
        return unit <= 0.04045 ? unit / 12.92 : Math.pow((unit + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function calculate_contrast(luminance, other_luminance) {
    const [lighter, darker] = luminance >= other_luminance ? [luminance, other_luminance] : [other_luminance, luminance];
    return (lighter + 0.05) / (darker + 0.05);
}

export function mix_rgb(rgb, other_rgb, percent) {
    const weight = percent / 100;
    return [0, 1, 2].map((index) => Math.round(rgb[index] * weight + other_rgb[index] * (1 - weight)));
}

export function convert_to_oklch(rgb) {
    const [red, green, blue] = rgb.map((channel) => {
        const unit = channel / 255;
        return unit <= 0.04045 ? unit / 12.92 : Math.pow((unit + 0.055) / 1.055, 2.4);
    });
    const cone_long = Math.cbrt(0.4122214708 * red + 0.5363325363 * green + 0.0514459929 * blue);
    const cone_medium = Math.cbrt(0.2119034982 * red + 0.6806995451 * green + 0.1073969566 * blue);
    const cone_short = Math.cbrt(0.0883024619 * red + 0.2817188376 * green + 0.6299787005 * blue);
    const green_red_axis = 1.9779984951 * cone_long - 2.4285922050 * cone_medium + 0.4505937099 * cone_short;
    const blue_yellow_axis = 0.0259040371 * cone_long + 0.7827717662 * cone_medium - 0.8086757660 * cone_short;
    return [
        0.2104542553 * cone_long + 0.7936177850 * cone_medium - 0.0040720468 * cone_short,
        Math.hypot(green_red_axis, blue_yellow_axis),
        (Math.atan2(blue_yellow_axis, green_red_axis) * 180 / Math.PI + 360) % 360,
    ];
}

export function convert_to_rgb(lightness, chroma, hue) {
    const green_red_axis = chroma * Math.cos(hue * Math.PI / 180);
    const blue_yellow_axis = chroma * Math.sin(hue * Math.PI / 180);
    const cone_long = (lightness + 0.3963377774 * green_red_axis + 0.2158037573 * blue_yellow_axis) ** 3;
    const cone_medium = (lightness - 0.1055613458 * green_red_axis - 0.0638541728 * blue_yellow_axis) ** 3;
    const cone_short = (lightness - 0.0894841775 * green_red_axis - 1.2914855480 * blue_yellow_axis) ** 3;
    const linear = [
        4.0767416621 * cone_long - 3.3077115913 * cone_medium + 0.2309699292 * cone_short,
        -1.2684380046 * cone_long + 2.6097574011 * cone_medium - 0.3413193965 * cone_short,
        -0.0041960863 * cone_long - 0.7034186147 * cone_medium + 1.7076147010 * cone_short,
    ];
    if (linear.some((value) => value < -GAMUT_TOLERANCE || value > 1 + GAMUT_TOLERANCE)) return null;
    return linear.map((value) => {
        const unit = Math.min(1, Math.max(0, value));
        return Math.round((unit <= 0.0031308 ? 12.92 * unit : 1.055 * Math.pow(unit, 1 / 2.4) - 0.055) * 255);
    });
}

export function find_vivid_rgb(lightness, hue) {
    let vivid = null;
    for (let chroma = 0; chroma <= GRID_CHROMA_MAXIMUM; chroma += SOURCE_CHROMA_STEP) {
        vivid = convert_to_rgb(lightness, chroma, hue) ?? vivid;
    }
    return vivid;
}

export function build_grid(source_rgb) {
    const [source_lightness, source_chroma, hue] = convert_to_oklch(source_rgb);
    const chroma_step_count = Math.round(GRID_CHROMA_MAXIMUM * GRID_RESOLUTION);
    const capacity = (GRID_RESOLUTION + 1) * (chroma_step_count + 1) + 1;
    const lightness = new Float64Array(capacity);
    const chroma = new Float64Array(capacity);
    const luminance = new Float64Array(capacity);
    const rgb = new Uint8Array(capacity * 3);
    lightness[0] = source_lightness;
    chroma[0] = source_chroma;
    luminance[0] = calculate_relative_luminance(source_rgb);
    rgb.set(source_rgb, 0);
    let length = 1;
    for (let lightness_step = 0; lightness_step <= GRID_RESOLUTION; lightness_step += 1) {
        for (let chroma_step = 0; chroma_step <= chroma_step_count; chroma_step += 1) {
            const point = convert_to_rgb(lightness_step / GRID_RESOLUTION, chroma_step / GRID_RESOLUTION, hue);
            if (!point) continue;
            lightness[length] = lightness_step / GRID_RESOLUTION;
            chroma[length] = chroma_step / GRID_RESOLUTION;
            luminance[length] = calculate_relative_luminance(point);
            rgb.set(point, length * 3);
            length += 1;
        }
    }
    return {
        hue,
        length,
        lightness: lightness.subarray(0, length),
        chroma: chroma.subarray(0, length),
        luminance: luminance.subarray(0, length),
        rgb: rgb.subarray(0, length * 3),
    };
}

function read_candidate(grid, index) {
    return {
        lightness: grid.lightness[index],
        chroma: grid.chroma[index],
        hue: grid.hue,
        rgb: Array.from(grid.rgb.subarray(index * 3, index * 3 + 3)),
        luminance: grid.luminance[index],
        exact: index === 0,
    };
}

export function find_nearest_candidate(grid, accepts) {
    let nearest = -1;
    let nearest_distance = Infinity;
    for (let index = 0; index < grid.length; index += 1) {
        const distance = (grid.lightness[index] - grid.lightness[0]) ** 2 + (grid.chroma[index] - grid.chroma[0]) ** 2;
        if (distance < nearest_distance && accepts(grid.luminance[index])) {
            nearest_distance = distance;
            nearest = index;
        }
    }
    return nearest < 0 ? null : read_candidate(grid, nearest);
}

export function find_best_candidate(grid, accepts, score) {
    let top = -Infinity;
    for (let index = 0; index < grid.length; index += 1) {
        if (accepts(grid.luminance[index])) top = Math.max(top, score(grid.luminance[index]));
    }
    let best = -1;
    let best_distance = Infinity;
    for (let index = 0; index < grid.length; index += 1) {
        if (!accepts(grid.luminance[index]) || score(grid.luminance[index]) < top - SCORE_TOLERANCE) continue;
        const distance = Math.abs(grid.chroma[index] - grid.chroma[0]) * CHROMA_WEIGHT + Math.abs(grid.lightness[index] - grid.lightness[0]);
        if (distance < best_distance) {
            best_distance = distance;
            best = index;
        }
    }
    return best < 0 ? null : read_candidate(grid, best);
}

export function solve_family(scheme_set, dark, grid) {
    const scheme_list = Object.values(scheme_set);
    const strictest_paper = scheme_list.map((scheme) => scheme.paper).reduce((first, second) => (dark === (calculate_relative_luminance(first) > calculate_relative_luminance(second)) ? first : second));
    const strictest_ink = scheme_list.map((scheme) => scheme.ink).reduce((first, second) => (dark === (calculate_relative_luminance(first) < calculate_relative_luminance(second)) ? first : second));
    const paper_luminance = calculate_relative_luminance(strictest_paper);
    const ink_luminance = calculate_relative_luminance(strictest_ink);

    const emphasis_ink = find_nearest_candidate(grid.emphasis, (luminance) => calculate_contrast(luminance, paper_luminance) >= CONTRAST_ENHANCED);
    const emphasis_paper = emphasis_ink && (
        find_nearest_candidate(grid.emphasis, (luminance) => calculate_contrast(luminance, paper_luminance) >= CONTRAST_GRAPHICAL
            && calculate_contrast(luminance, ink_luminance) >= CONTRAST_MINIMUM
            && calculate_contrast(luminance, emphasis_ink.luminance) >= EMPHASIS_DISTINCTNESS)
        ?? find_best_candidate(
            grid.emphasis,
            (luminance) => calculate_contrast(luminance, ink_luminance) >= CONTRAST_MINIMUM
                && calculate_contrast(luminance, emphasis_ink.luminance) >= EMPHASIS_DISTINCTNESS,
            (luminance) => calculate_contrast(luminance, paper_luminance),
        )
    );
    const highlight_ink = find_nearest_candidate(grid.highlight, (luminance) => calculate_contrast(luminance, paper_luminance) >= CONTRAST_MINIMUM);
    const highlight_paper = emphasis_ink && find_nearest_candidate(grid.highlight, (luminance) => calculate_contrast(luminance, ink_luminance) >= CONTRAST_MINIMUM
        && calculate_contrast(luminance, emphasis_ink.luminance) >= CONTRAST_GRAPHICAL);
    const success = find_nearest_candidate(grid.success, (luminance) => calculate_contrast(luminance, paper_luminance) >= CONTRAST_GRAPHICAL);
    const error = find_nearest_candidate(grid.error, (luminance) => calculate_contrast(luminance, paper_luminance) >= CONTRAST_GRAPHICAL);
    const visited = find_nearest_candidate(grid.visited, (luminance) => calculate_contrast(luminance, paper_luminance) >= CONTRAST_ENHANCED);
    return { emphasis_ink, emphasis_paper, highlight_ink, highlight_paper, success, error, visited };
}

// Requirements that must hold in EVERY scheme of the family.
export function check_requirement(palette, scheme_set) {
    const missing = Object.entries(palette).filter(([, candidate]) => !candidate).map(([role]) => `${role}: NO SOLUTION`);
    if (missing.length) return missing;

    const failure = [];
    for (const [name, scheme] of Object.entries(scheme_set)) {
        const ink_mix = scheme.collapse_mix ? scheme.ink : mix_rgb(scheme.ink, scheme.paper, scheme.ink_mix_percent);
        const paper_mix = scheme.collapse_mix ? scheme.paper : mix_rgb(scheme.ink, scheme.paper, PAPER_MIX_PERCENT);
        const emphasis_mix = scheme.collapse_mix ? palette.emphasis_ink.rgb : mix_rgb(palette.emphasis_ink.rgb, scheme.ink, EMPHASIS_MIX_PERCENT);
        const row = [
            ["ink vs paper", scheme.ink, scheme.paper, CONTRAST_ENHANCED],
            ["ink-mix vs paper", ink_mix, scheme.paper, CONTRAST_MINIMUM],
            ["paper-mix vs eMix", paper_mix, emphasis_mix, CONTRAST_ENHANCED],
            ["emphasis-ink vs paper", palette.emphasis_ink.rgb, scheme.paper, CONTRAST_ENHANCED],
            ["eMix vs paper", emphasis_mix, scheme.paper, CONTRAST_ENHANCED],
            ["emphasis-paper vs paper", palette.emphasis_paper.rgb, scheme.paper, CONTRAST_GRAPHICAL],
            ["emphasis-paper vs ink", palette.emphasis_paper.rgb, scheme.ink, CONTRAST_MINIMUM],
            ["hl-ink vs its text", palette.highlight_ink.rgb, scheme.paper, CONTRAST_MINIMUM],
            ["hl-ink vs paper fill", palette.highlight_ink.rgb, scheme.paper, CONTRAST_GRAPHICAL],
            ["hl-ink vs paper-mix", palette.highlight_ink.rgb, paper_mix, CONTRAST_GRAPHICAL],
            ["hl-paper vs its text", palette.highlight_paper.rgb, scheme.ink, CONTRAST_MINIMUM],
            ["hl-paper vs emphasis-ink", palette.highlight_paper.rgb, palette.emphasis_ink.rgb, CONTRAST_GRAPHICAL],
            ["hl-paper vs eMix", palette.highlight_paper.rgb, emphasis_mix, CONTRAST_GRAPHICAL],
            ["success vs paper", palette.success.rgb, scheme.paper, CONTRAST_GRAPHICAL],
            ["error vs paper", palette.error.rgb, scheme.paper, CONTRAST_GRAPHICAL],
            ["visited vs paper", palette.visited.rgb, scheme.paper, CONTRAST_ENHANCED],
        ];
        for (const [label, rgb, other_rgb, required] of row) {
            const contrast = calculate_contrast(calculate_relative_luminance(rgb), calculate_relative_luminance(other_rgb));
            if (contrast < required) failure.push(`${name}: ${label} (${required}:1) = ${contrast.toFixed(2)} < ${required}`);
        }
    }
    return failure;
}

export function solve_every_family(scheme_table, emphasis_grid, fixed_grid) {
    const grid = { ...fixed_grid, emphasis: emphasis_grid };
    return Object.fromEntries(Object.entries(scheme_table).map(([name, scheme_set]) => {
        const palette = solve_family(scheme_set, name === "dark", grid);
        return [name, { palette, failure: check_requirement(palette, scheme_set) }];
    }));
}

export function format_color(candidate) {
    return candidate.exact
        ? `rgb(${candidate.rgb.join(" ")})`
        : `oklch(${candidate.lightness.toFixed(3)} ${candidate.chroma.toFixed(3)} ${candidate.hue.toFixed(1)})`;
}
