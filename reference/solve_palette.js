import { CHANNEL, FAMILY, FIXED_SOURCE, build_grid, solve_every_family } from "./palette.js";

const ROLE_CHANNEL = {
    emphasis_ink: "emphasis",
    emphasis_paper: "emphasis",
    highlight_ink: "accent_yellow",
    highlight_paper: "accent_yellow",
    success: "accent_green",
    error: "accent_red",
    visited: "accent_purple",
};

function parse_hex(text) {
    const digit = text.replace(/^#/, "");
    return /^[0-9a-fA-F]{6}$/.test(digit) ? [0, 2, 4].map((index) => parseInt(digit.slice(index, index + 2), 16)) : null;
}

function format_channel(channel, emphasis_name) {
    if (channel !== "emphasis") return `rgb(var(--rgb-${channel.replace(/_/g, "-")}))`;
    return emphasis_name.startsWith("#") ? emphasis_name : `rgb(var(--rgb-${emphasis_name}))`;
}

function format_family(name, result, emphasis_name) {
    const line = [`\n=== ${name} family ===`];
    for (const [role, channel] of Object.entries(ROLE_CHANNEL)) {
        const candidate = result.palette[role];
        const property = "--color-" + role.replace(/_/g, "-");
        if (!candidate) {
            line.push(`${property}: NO SOLUTION`);
            continue;
        }
        const value = candidate.exact
            ? format_channel(channel, emphasis_name)
            : `oklch(from ${format_channel(channel, emphasis_name)} ${candidate.lightness.toFixed(3)} ${candidate.chroma.toFixed(3)} h)`;
        line.push(`${property}: ${value};  -> rgb(${candidate.rgb})`);
    }
    line.push(result.failure.length ? result.failure.map((entry) => "  FAIL " + entry).join("\n") : "  all rows pass");
    return line.join("\n");
}

const argument = process.argv[2] ?? "";
const emphasis_source = parse_hex(argument) ?? CHANNEL.accent_purple;
const emphasis_name = parse_hex(argument) ? `#${argument.replace(/^#/, "").toUpperCase()}` : "accent-purple";

const fixed_grid = Object.fromEntries(Object.entries(FIXED_SOURCE).map(([role, source]) => [role, build_grid(source)]));
const result = solve_every_family(FAMILY, build_grid(emphasis_source), fixed_grid);

console.log(`emphasis source: ${emphasis_name} rgb(${emphasis_source})`);
for (const [name, family_result] of Object.entries(result)) console.log(format_family(name, family_result, emphasis_name));
