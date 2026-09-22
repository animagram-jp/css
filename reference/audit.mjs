import { chromium } from 'playwright-core';
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

// Audits index.html once per [data-color-scheme] value.
const require = createRequire(import.meta.url);
const ACE_PATH = require.resolve('accessibility-checker-engine/ace-window.js');
const PAGE = path.resolve(import.meta.dirname, '..', 'index.html');
const OUT = path.resolve(import.meta.dirname, 'audit.json');

const GUIDELINE = 'WCAG_2_2';

const SCHEMES = [
    { name: 'light',               colorScheme: 'light', contrast: 'no-preference' },
    { name: 'dark',                colorScheme: 'dark',  contrast: 'no-preference' },
    { name: 'light-high-contrast', colorScheme: 'light', contrast: 'more' },
    { name: 'dark-high-contrast',  colorScheme: 'dark',  contrast: 'more' },
    { name: 'light-less-contrast', colorScheme: 'light', contrast: 'no-preference' },
    { name: 'dark-less-contrast',  colorScheme: 'dark',  contrast: 'no-preference' },
];

// FAIL is a definite breach; POTENTIAL needs a human to confirm and is kept for
// the same reason axe's `incomplete` was — dropping it would report "no
// problems" for checks that never reached a verdict. PASS is dropped: 4000+
// rows per scheme that the report never shows.
const KEPT = ['FAIL', 'POTENTIAL'];

const run = (page) => page.evaluate(async ({ guideline, kept }) => {
    const checker = new window.ace.Checker();

    // num/wcagLevel live on the guideline, not on results, so the mapping is
    // rebuilt here and flattened onto each finding.
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
    const findings = report.results
        .filter(r => kept.includes(r.value[1]))
        .map(r => ({
            ruleId: r.ruleId,
            reasonId: r.reasonId,
            policy: r.value[0],
            outcome: r.value[1],
            criteria: criteria[r.ruleId] ?? [],
            message: r.message,
            snippet: r.snippet,
            path: r.path?.dom ?? '',
            bounds: r.bounds,
        }));

    return { findings, numExecuted: report.numExecuted };
}, { guideline: GUIDELINE, kept: KEPT });

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
    await page.addScriptTag({ path: ACE_PATH });

    const { findings, numExecuted } = await run(page);
    results.push({ scheme: scheme.name, findings, numExecuted });

    const count = (outcome) => findings.filter(f => f.outcome === outcome).length;
    console.log(
        `[${scheme.name}] ${count('FAIL')} failing, ` +
        `${count('POTENTIAL')} needing review (${numExecuted} rules run)`
    );

    await context.close();
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
    `done: reference/audit.json (${results.length} scans, ` +
    `${total('FAIL')} failing, ${total('POTENTIAL')} needing review)`
);
