import { chromium } from 'playwright-core';
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

// Audits index.html once per [data-color-scheme] value.
// axe-core only inspects what is currently rendered, so each scheme is applied
// live via Playwright. [data-color-scheme] alone selects the whole palette;
// prefers-color-scheme is emulated to match so the UA picks the same form
// control rendering. prefers-contrast has no `less` value in Playwright, so the
// less-contrast schemes are driven by the attribute only — which is what a user
// selecting a scheme explicitly gets anyway.
// color-contrast falls into `incomplete` whenever axe cannot resolve a
// background, so incomplete is collected too — dropping it would silently
// report "no contrast violations" for colors that were never actually checked.
const require = createRequire(import.meta.url);
const AXE_PATH = require.resolve('axe-core/axe.min.js');
const PAGE = path.resolve(import.meta.dirname, '..', 'index.html');
const OUT = path.resolve(import.meta.dirname, 'audit.json');

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

const SCHEMES = [
    { name: 'light',               colorScheme: 'light', contrast: 'no-preference' },
    { name: 'dark',                colorScheme: 'dark',  contrast: 'no-preference' },
    { name: 'light-high-contrast', colorScheme: 'light', contrast: 'more' },
    { name: 'dark-high-contrast',  colorScheme: 'dark',  contrast: 'more' },
    { name: 'light-less-contrast', colorScheme: 'light', contrast: 'no-preference' },
    { name: 'dark-less-contrast',  colorScheme: 'dark',  contrast: 'no-preference' },
];

// Only violations and incomplete are kept, and each node is trimmed to what the
// report actually renders. The untrimmed payload is ~60MB of mostly-duplicated
// rule metadata.
const run = (page) => page.evaluate(async ({ tags }) => {
    const trim = (rules) => rules.map(v => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        help: v.help,
        helpUrl: v.helpUrl,
        nodes: v.nodes.map(n => ({
            target: n.target,
            html: n.html,
            failureSummary: n.failureSummary,
        })),
    }));
    const { violations, incomplete } = await window.axe.run(document, {
        runOnly: { type: 'tag', values: tags },
        resultTypes: ['violations', 'incomplete'],
    });
    return { violations: trim(violations), incomplete: trim(incomplete) };
}, { tags: TAGS });

const browser = await chromium.launch();
const results = [];

for (const scheme of SCHEMES) {
    const context = await browser.newContext({ colorScheme: scheme.colorScheme });
    const page = await context.newPage();
    await page.emulateMedia({
        colorScheme: scheme.colorScheme,
        contrast: scheme.contrast,
    });
    await page.goto(pathToFileURL(PAGE).href, { waitUntil: 'load' });
    await page.evaluate((name) => {
        document.documentElement.setAttribute('data-color-scheme', name);
    }, scheme.name);
    await page.addScriptTag({ path: AXE_PATH });

    const { violations, incomplete } = await run(page);
    results.push({ scheme: scheme.name, violations, incomplete });

    const count = (rules) => rules.reduce((n, v) => n + v.nodes.length, 0);
    console.log(
        `[${scheme.name}] ${count(violations)} violating nodes, ` +
        `${count(incomplete)} incomplete nodes`
    );

    await context.close();
}

await browser.close();

writeFileSync(OUT, JSON.stringify({
    generated: new Date().toISOString(),
    schemes: SCHEMES.map(s => s.name),
    tags: TAGS,
    results,
}, null, 2));

const total = (key) => results.reduce((n, r) =>
    n + r[key].reduce((m, v) => m + v.nodes.length, 0), 0);
console.log(
    `done: reference/audit.json (${results.length} scans, ` +
    `${total('violations')} violating nodes, ${total('incomplete')} incomplete nodes)`
);
