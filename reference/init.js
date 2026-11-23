// example Javascript for animagram-jp/css/index.html demonstration and test

import { FAMILY, FIXED_SOURCE, SOURCE_LIGHTNESS, build_grid, find_vivid_rgb, solve_every_family, format_color } from "./palette.js";

const ICON_BADGE = {
    active:      { fill: "rgb(44,134,89)",  stroke: "rgb(255,255,255)" },
    information: { fill: "rgb(127,135,143)", stroke: "rgb(255,255,255)" },
};

const ICON_BADGE_RADIUS_RATIO = 5 / 32;
const ICON_BADGE_STROKE_RATIO = 0.3; // stroke width against radius

const EMPHASIS_ROLES = ["emphasis_ink"];

const REPORT_URL = "./reference/test.json";
const REPORT_ROW_MAXIMUM = 32;
const REPORT_CELL_COUNT = 7;

const OPERATION_TEXT = 1;
const OPERATION_SET_ATTRIBUTE = 3;
const OPERATION_REMOVE_ATTRIBUTE = 4;

const S = {
    root: document.documentElement,
    eruda: false,
    header_button: null,
    icon_badge: null,
    passwords: new Map(),
    steps: new Map(),
    fixed_grid: null,
};

function start() {
    S.eruda = new URLSearchParams(location.search).has("eruda");
    if (S.eruda) {
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/npm/eruda@3.4.3/eruda.js";
        s.integrity = "sha384-weDBY9jeIj4NqaiZF9f6PMAMMY4lIu+0CAI+TjBIE73RctCQOxDoEHltYnstRszI";
        s.crossOrigin = "anonymous";
        s.onload = () => eruda.init();
        document.body.appendChild(s);
    }

    for (const input of document.querySelectorAll('input[type="checkbox"][data-indeterminate]')) {
        input.indeterminate = true;
    }

    S.header_button = document.getElementById("header_button");
    const scheme = document.querySelector(`input[name="color-scheme"][value="${preferred_color_scheme()}"]`)
        ?? document.querySelector('input[name="color-scheme"]');
    if (scheme) {
        scheme.checked = true;
        set_color_scheme(scheme);
    }

    const link = [...document.querySelectorAll('link[rel~="icon"]')].find((link) => link.href && !link.href.startsWith("data:,"));
    if (link && document.querySelector('input[name="icon-badge"]')) {
        const canvas = document.createElement("canvas");
        const base = new Image();
        base.crossOrigin = "anonymous";
        base.src = link.href;
        S.icon_badge = { link, href: link.href, canvas, context: canvas.getContext("2d"), base };
    }

    for (const input of document.querySelectorAll('label > input[type="password"]')) {
        const button = input.parentElement.querySelector(":scope > input[aria-controls]");
        if (!button) continue;
        button.hidden = false;
        S.passwords.set(button, input);
    }

    for (const input of document.querySelectorAll('input[role="spinbutton"]')) {
        const label = input.closest("label");
        if (!label) continue;
        const step = Number(input.step) || 1;
        const min = input.min === "" ? -Infinity : Number(input.min);
        const max = input.max === "" ? Infinity : Number(input.max);
        for (const button of label.querySelectorAll(":scope > button[data-sign]")) {
            S.steps.set(button, { input, step, min, max, sign: button.dataset.sign === "plus" ? 1 : -1 });
        }
    }

    if (document.querySelector('input[name="hue"]')) {
        S.fixed_grid = Object.fromEntries(Object.entries(FIXED_SOURCE).map(([role, source]) => [role, build_grid(source)]));
    }

    document.addEventListener("focusin", (e) => {
        if (e.target.matches('input[inputmode="numeric"][maxlength]')) e.target.select();
    });

    if (document.getElementById("tabpanel-4_table")) load_report();
}

function bind() {
    document.addEventListener("change", on_change);
    document.addEventListener("click", on_click);
    document.addEventListener("submit", on_submit);

    if (S.icon_badge) {
        S.icon_badge.base.addEventListener("load", draw_icon_badge);
        S.icon_badge.base.addEventListener("error", () => {
            console.warn("icon-badge: failed to load base icon image.");
        });
    }
}

function on_change(e) {
    const target = e.target;
    const password = S.passwords.get(target);
    if (password) {
        password.type = target.checked ? "text" : "password";
        return;
    }
    switch (target.name) {
        case "color-scheme": set_color_scheme(target); break;
        case "hue":          apply_hue(Number(target.value)); break;
        case "icon-badge":   draw_icon_badge(); break;
    }
}

function on_click(e) {
    const step = S.steps.get(e.target.closest("button[data-sign]"));
    if (!step) return;
    const next = (Number(step.input.value) || 0) + step.sign * step.step;
    step.input.value = Math.min(step.max, Math.max(step.min, next));
    step.input.dispatchEvent(new Event("input", { bubbles: true }));
}

function on_submit(e) {
    if (S.eruda) e.preventDefault();
    for (const [button, input] of S.passwords) {
        if (input.form !== e.target) continue;
        input.type = "password";
        button.checked = false;
    }
}

// === color scheme ===

function set_color_scheme(radio) {
    S.root.setAttribute("data-color-scheme", radio.value);
    if (S.header_button) S.header_button.textContent = radio.nextElementSibling.textContent;
}

function apply_hue(hue) {
    if (!S.fixed_grid) return;
    const source_rgb = find_vivid_rgb(SOURCE_LIGHTNESS, hue);
    const emphasis_grid = build_grid(source_rgb);
    const source = `rgb(${source_rgb.join(" ")})`;
    const result = solve_every_family(FAMILY, emphasis_grid, S.fixed_grid);
    for (const role of EMPHASIS_ROLES) {
        const [light, dark] = [result.light.palette[role], result.dark.palette[role]];
        if (!light || !dark) return;
        S.root.style.setProperty("--color-" + role.replace(/_/g, "-"), `light-dark(${format_color(light, source)}, ${format_color(dark, source)})`);
    }
}

function preferred_color_scheme() {
    const scheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const contrast = window.matchMedia("(prefers-contrast: more)").matches ? "-more-contrast"
        : window.matchMedia("(prefers-contrast: less)").matches ? "-less-contrast"
        : "";
    return `${scheme}${contrast}`;
}

// === icon badge ===

function draw_icon_badge() {
    if (!S.icon_badge) return;
    const { link, href, canvas, context, base } = S.icon_badge;
    const name = document.querySelector('input[name="icon-badge"]:checked')?.value;
    if (name === "none" || !base.complete) {
        link.href = href;
        return;
    }

    const badge = ICON_BADGE[name];
    const size = Math.min(base.naturalWidth, base.naturalHeight);
    if (!badge || !size) return;

    const radius = size * ICON_BADGE_RADIUS_RATIO;
    const stroke = radius * ICON_BADGE_STROKE_RATIO;
    const center = size - radius - stroke;
    canvas.width = canvas.height = size;

    context.clearRect(0, 0, size, size);
    context.imageSmoothingQuality = "high";
    context.drawImage(base, 0, 0, size, size);

    context.beginPath();
    context.arc(center, center, radius, 0, Math.PI * 2);
    context.strokeStyle = badge.stroke;
    context.lineWidth = stroke * 2;
    context.stroke();

    context.beginPath();
    context.arc(center, center, radius, 0, Math.PI * 2);
    context.fillStyle = badge.fill;
    context.fill();

    try {
        link.href = canvas.toDataURL("image/png");
    } catch (err) {
        console.warn("icon-badge: canvas is tainted, skipping badge overlay.", err);
        link.href = href;
    }
}

function execute(command) {
    const [operation, id, ...operands] = command;
    const el = document.getElementById(id);
    if (!el) return;
    switch (operation) {
        case OPERATION_TEXT:             el.textContent = operands[0] ?? ""; break;
        case OPERATION_SET_ATTRIBUTE:    el.setAttribute(operands[0], operands[1] ?? ""); break;
        case OPERATION_REMOVE_ATTRIBUTE: el.removeAttribute(operands[0]); break;
    }
}

async function load_report() {
    let report;
    try {
        const response = await fetch(REPORT_URL);
        if (!response.ok) throw new Error(`${response.status}`);
        report = await response.json();
    } catch (err) {
        execute([OPERATION_TEXT, "tabpanel-4_p", `${REPORT_URL}: ${err?.message ?? err}`]);
        return;
    }
    for (const command of build_report_commands(report)) execute(command);
}

function build_report_commands(report) {
    const groups = group_findings(report);
    const failing = groups.filter((g) => g.outcome === "FAIL").length;
    const shown = Math.min(groups.length, REPORT_ROW_MAXIMUM);
    const commands = [
        [OPERATION_TEXT, "tabpanel-4_p", `Generated: ${report.generated} — ${report.guideline} — ${report.schemes.length} schemes`],
        [OPERATION_TEXT, "tabpanel-4_caption",
            `${groups.length} findings across ${report.results.length} scans — ${failing} failing, ${groups.length - failing} needing review` +
            (shown < groups.length ? ` — ${shown} shown` : "")],
    ];
    if (groups.length > 0) commands.push([OPERATION_REMOVE_ATTRIBUTE, "tabpanel-4_table", "hidden"]);

    for (let index = 0; index < REPORT_ROW_MAXIMUM; index++) {
        const row = `tabpanel-4_tr-${index + 1}`;
        const g = groups[index];
        if (!g) {
            commands.push([OPERATION_SET_ATTRIBUTE, row, "hidden"]);
            continue;
        }
        const cells = [
            g.criterion.level,
            g.criterion.name,
            g.rule_id,
            g.outcome,
            g.state,
            g.schemes.size === report.schemes.length ? "all" : [...g.schemes].join(", "),
            String(g.paths.size),
        ];
        commands.push([OPERATION_TEXT, `${row}_th`, g.criterion.num]);
        for (let cell = 0; cell < REPORT_CELL_COUNT; cell++) {
            commands.push([OPERATION_TEXT, `${row}_td-${cell + 1}`, cells[cell]]);
        }
        commands.push([OPERATION_REMOVE_ATTRIBUTE, row, "hidden"]);
    }
    return commands;
}

function group_findings(report) {
    const groups = new Map();
    for (const result of report.results) {
        for (const finding of result.findings) {
            const criteria = finding.criteria.length ? finding.criteria : [{ num: "—", level: "", name: "Unmapped" }];
            for (const criterion of criteria) {
                const state = finding.state ?? "default";
                const key = `${criterion.num}|${finding.ruleId}|${finding.reasonId}|${finding.outcome}|${state}`;
                let g = groups.get(key);
                if (!g) {
                    g = { criterion, rule_id: finding.ruleId, outcome: finding.outcome, state, schemes: new Set(), paths: new Set() };
                    groups.set(key, g);
                }
                g.schemes.add(result.scheme);
                g.paths.add(finding.path);
            }
        }
    }
    const order = (num) => num.split(".").map((n) => n.padStart(3, "0")).join(".");
    return [...groups.values()].sort((a, b) =>
        order(a.criterion.num).localeCompare(order(b.criterion.num)) ||
        (a.outcome === b.outcome ? 0 : a.outcome === "FAIL" ? -1 : 1) ||
        b.paths.size - a.paths.size);
}

// === toast ===

const js_fn = {
    show_toast: (el) => {
        cancel_toast_cycle(el);
        el.classList.remove("hide");
        el.hidden = false;
        requestAnimationFrame(() => requestAnimationFrame(() => {
            el.classList.add("show");
            const timer = setTimeout(() => js_fn.hide_toast(el), 3000);
            toast_cycles.set(el, { timer, controller: new AbortController() });
        }));
    },
    hide_toast: (el) => {
        cancel_toast_cycle(el);
        const controller = new AbortController();
        const finish = () => {
            clearTimeout(fallback);
            el.classList.remove("hide");
            el.hidden = true;
        };
        el.classList.replace("show", "hide");
        el.addEventListener("transitionend", finish, { once: true, signal: controller.signal });
        const fallback = setTimeout(finish, 250);
        toast_cycles.set(el, { timer: fallback, controller });
    },
};

const cancel_toast_cycle = (el) => {
    const cycle = toast_cycles.get(el);
    if (!cycle) return;
    clearTimeout(cycle.timer);
    cycle.controller.abort();
};

const toast_cycles = new WeakMap();

window.js_fn = js_fn;

start();
bind();
