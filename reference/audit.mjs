import { chromium } from 'playwright-core';
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

// Audits index.html under BOTH color schemes, across:
//   - static state (the normal/disabled markup already in the page)
//   - :hover / :active / :focus-visible on every enabled button
// axe-core only ever inspects what's currently rendered, so pseudo-classes
// and prefers-color-scheme both need to be triggered live via Playwright —
// neither is visible to a plain static scan.
const require = createRequire(import.meta.url);
const AXE_PATH = require.resolve('axe-core/axe.min.js');
const PAGE = path.resolve(import.meta.dirname, '..', 'index.html');
const OUT = path.resolve(import.meta.dirname, 'audit.json');

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const SCHEMES = ['light', 'dark'];
const ENABLED = 'button:not([disabled], [aria-disabled="true"])';

// axe.run resolves with the full result set; only violations are kept, and each
// node is trimmed to what the report actually renders. The untrimmed payload is
// ~60MB of mostly-duplicated rule metadata.
const run = (page, include) => page.evaluate(async ({ tags, include }) => {
    const { violations } = await window.axe.run(include ?? document, {
        runOnly: { type: 'tag', values: tags },
        resultTypes: ['violations'],
    });
    return violations.map(v => ({
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
}, { tags: TAGS, include });

const browser = await chromium.launch();
const results = [];

for (const scheme of SCHEMES) {
    const context = await browser.newContext({ colorScheme: scheme });
    const page = await context.newPage();
    await page.goto(pathToFileURL(PAGE).href, { waitUntil: 'load' });
    await page.addScriptTag({ path: AXE_PATH });

    // stray mouse/keyboard interaction during hover/active/focus probing can land
    // on a submit button and trigger a real navigation, which kills the page's
    // execution context mid-scan — block all form submission for the audit run.
    await page.evaluate(() => {
        document.addEventListener('submit', e => e.preventDefault(), true);
    });

    // static: whatever is already in the markup (normal + disabled buttons)
    results.push({ scheme, state: 'static', label: '(all)', violations: await run(page) });

    const all = await page.$$(ENABLED);
    const visible = await Promise.all(all.map(b => b.isVisible()));
    const buttons = all.filter((_, i) => visible[i]);
    console.log(`[${scheme}] found ${buttons.length} enabled buttons`);

    for (const [index, handle] of buttons.entries()) {
        const label = await handle.evaluate(el =>
            `${el.getAttribute('data-type')}/${el.getAttribute('data-size') || 'md'}`);
        const probe = async (state, act) => {
            await act();
            results.push({ scheme, state, label, index, violations: await run(page, ENABLED) });
        };

        await probe('hover', () => handle.hover());
        await probe('active', async () => {
            await handle.hover();
            await page.mouse.down();
        });
        await page.mouse.up();
        await probe('focus-visible', () => handle.evaluate(el => el.focus()));
        await handle.evaluate(el => el.blur());
    }

    await context.close();
}

await browser.close();

writeFileSync(OUT, JSON.stringify({
    generated: new Date().toISOString(),
    schemes: SCHEMES,
    tags: TAGS,
    results,
}, null, 2));

const nodes = results.reduce((n, r) =>
    n + r.violations.reduce((m, v) => m + v.nodes.length, 0), 0);
console.log(`done: reference/audit.json (${results.length} scans, ${nodes} violating nodes)`);
