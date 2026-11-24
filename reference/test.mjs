import { chromium } from "playwright-core";
import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const ACE_PATH = require.resolve("accessibility-checker-engine/ace-window.js");
const PAGE = path.resolve(import.meta.dirname, "..", "index.html");
const OUT = path.resolve(import.meta.dirname, "test.json");

const GUIDELINE = "WCAG_2_2";

const SCHEMES = [
    { name: "light",               colorScheme: "light", contrast: "no-preference" },
    { name: "dark",                colorScheme: "dark",  contrast: "no-preference" },
    { name: "light-more-contrast", colorScheme: "light", contrast: "more" },
    { name: "dark-more-contrast",  colorScheme: "dark",  contrast: "more" },
    { name: "light-less-contrast", colorScheme: "light", contrast: "no-preference" },
    { name: "dark-less-contrast",  colorScheme: "dark",  contrast: "no-preference" },
];

const KEPT = ["FAIL", "POTENTIAL"];

const CONTRAST = "text_contrast_sufficient";

const IGNORED = [
    { ruleId: "input_checkboxes_grouped", selector: '[role="tablist"] input[type="radio"][role="tab"]' },
    { ruleId: CONTRAST,                   selector: 'label:has(:disabled, [aria-disabled="true"])' },
];

const STATES = [
    { name: "default", pseudo: [], scope: null },
    { name: "active",  pseudo: ["active"], scope: 'a:any-link, button, [type="button"], [type="submit"], [type="reset"], summary' },
];

const PROPERTIES = ["color", "background-color"];

const normalize = (page) => page.evaluate((properties) => {
    const canvas = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
    const convert = (value) => {
        canvas.clearRect(0, 0, 1, 1);
        canvas.fillStyle = value;
        canvas.fillRect(0, 0, 1, 1);
        const [r, g, b, a] = canvas.getImageData(0, 0, 1, 1).data;
        return `rgba(${r}, ${g}, ${b}, ${+(a / 255).toFixed(3)})`;
    };
    const select = (element) => {
        const steps = [];
        for (let node = element; node !== document.documentElement; node = node.parentElement) {
            steps.unshift(`:nth-child(${[...node.parentElement.children].indexOf(node) + 1})`);
        }
        return [":root", ...steps].join(" > ");
    };
    const rules = [];
    let count = 0;
    for (const element of document.querySelectorAll("*")) {
        const style = getComputedStyle(element);
        const declarations = [];
        for (const property of properties) {
            const value = style.getPropertyValue(property);
            if (!value.startsWith("rgb")) {
                declarations.push(`${property}: ${convert(value)} !important;`);
            }
        }
        if (declarations.length > 0) {
            rules.push(`${select(element)} { ${declarations.join(" ")} }`);
            count += declarations.length;
        }
    }
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(rules.join("\n"));
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
    return count;
}, PROPERTIES);

const flatten = (page) => page.evaluate(() => {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync("* { position: static !important; }");
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
});

const force = async (session, selector, pseudo) => {
    await session.send("DOM.enable");
    await session.send("CSS.enable");
    const { root } = await session.send("DOM.getDocument", { depth: -1 });
    const { nodeIds } = await session.send("DOM.querySelectorAll", { nodeId: root.nodeId, selector });
    for (const nodeId of nodeIds) {
        await session.send("CSS.forcePseudoState", { nodeId, forcedPseudoClasses: pseudo });
    }
    return nodeIds.length;
};

const open = async (browser, scheme) => {
    const context = await browser.newContext({ colorScheme: scheme.colorScheme });
    const page = await context.newPage();
    await page.emulateMedia({
        colorScheme: scheme.colorScheme,
        contrast: scheme.contrast,
    });
    await page.goto(pathToFileURL(PAGE).href, { waitUntil: "load" });
    await page.evaluate((name) => {
        document.documentElement.setAttribute("data-color-scheme", name);
    }, scheme.name);
    return { context, page };
};

const run = (page, scope = null) => page.evaluate(async ({ guideline, kept, ignored, scope }) => {
    const checker = new window.ace.Checker();
    const criteria = {};
    const guidelineObj = checker.getGuidelines().find(g => g.id === guideline);
    for (const cp of guidelineObj.checkpoints) {
        for (const rule of cp.rules ?? []) {
            (criteria[rule.id] ??= []).push({
                num: cp.num,
                level: cp.wcagLevel,
                name: cp.name,
            });
        }
    }

    const report = await checker.check(document, [guideline]);
    const within = (r, selector) => {
        if (!r.path?.dom) {
            return false;
        }
        const node = document.evaluate(r.path.dom, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return node?.closest?.(selector) != null;
    };
    const isIgnored = (r) => ignored.some(i => i.ruleId === r.ruleId && within(r, i.selector));
    const scoped = report.results
        .filter(r => kept.includes(r.value[1]))
        .filter(r => scope === null || within(r, scope));
    const findings = scoped
        .filter(r => !isIgnored(r))
        .map(r => ({
            ruleId: r.ruleId,
            reasonId: r.reasonId,
            policy: r.value[0],
            outcome: r.value[1],
            criteria: criteria[r.ruleId] ?? [],
            message: r.message,
            snippet: r.snippet,
            path: r.path?.dom ?? "",
            bounds: r.bounds,
        }));

    return {
        findings,
        ignored: scoped.filter(isIgnored).map(r => r.ruleId),
        numExecuted: report.numExecuted,
    };
}, { guideline: GUIDELINE, kept: KEPT, ignored: IGNORED, scope });

const browser = await chromium.launch();
const results = [];

for (const scheme of SCHEMES) {
    const { context, page } = await open(browser, scheme);
    const normalized = await normalize(page);
    await page.addScriptTag({ path: ACE_PATH });
    const { findings: layout, ignored: layoutIgnored, numExecuted } = await run(page);
    await context.close();

    const findings = layout
        .filter(f => f.ruleId !== CONTRAST)
        .map(f => ({ ...f, state: "default" }));
    const forced = {};
    let ignored = layoutIgnored.filter(id => id !== CONTRAST).length;

    for (const state of STATES) {
        const { context, page } = await open(browser, scheme);
        const session = await context.newCDPSession(page);
        if (state.scope !== null) {
            forced[state.name] = await force(session, state.scope, state.pseudo);
        }
        await flatten(page);
        await normalize(page);
        await page.addScriptTag({ path: ACE_PATH });
        const { findings: contrast, ignored: contrastIgnored } = await run(page, state.scope);
        ignored += contrastIgnored.filter(id => id === CONTRAST).length;
        findings.push(...contrast
            .filter(f => f.ruleId === CONTRAST)
            .map(f => ({ ...f, state: state.name })));
        await context.close();
    }

    results.push({ scheme: scheme.name, findings, ignored, numExecuted, normalized, forced });

    const count = (outcome) => findings.filter(f => f.outcome === outcome).length;
    const states = Object.entries(forced).map(([name, n]) => `${n} ${name}`).join(", ");
    console.log(
        `[${scheme.name}] ${count("FAIL")} failing, ` +
        `${count("POTENTIAL")} needing review, ${ignored} ignored (${numExecuted} rules run, ` +
        `${normalized} colors normalized, ${states} forced)`
    );
}

await browser.close();

writeFileSync(OUT, JSON.stringify({
    generated: new Date().toISOString(),
    guideline: GUIDELINE,
    schemes: SCHEMES.map(s => s.name),
    results,
}, null, 2));

const total = (outcome) => results.reduce(
    (n, r) => n + r.findings.filter(f => f.outcome === outcome).length, 0);
console.log(
    `done: reference/test.json (${results.length} scans, ` +
    `${total("FAIL")} failing, ${total("POTENTIAL")} needing review, ` +
    `${results.reduce((n, r) => n + r.ignored, 0)} ignored)`
);
