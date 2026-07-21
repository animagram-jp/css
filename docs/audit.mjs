import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

// Audits index.html under BOTH color schemes, across:
//   - static state (the normal/disabled markup already in the page)
//   - :hover / :active / :focus-visible on every enabled .css-button
// axe-core only ever inspects what's currently rendered, so pseudo-classes
// and prefers-color-scheme both need to be triggered live via Playwright —
// neither is visible to a plain static scan.
const OUT = 'docs';
mkdirSync(OUT, { recursive: true });

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const SCHEMES = ['light', 'dark'];

const esc = s => String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const browser = await chromium.launch();
const allResults = [];

for (const scheme of SCHEMES) {
    const context = await browser.newContext({ colorScheme: scheme });
    const page = await context.newPage();
    const url = pathToFileURL(path.resolve('index.html')).href;
    await page.goto(url, { waitUntil: 'load' });

    // static: whatever is already in the markup (normal + disabled buttons)
    const staticResults = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    allResults.push({ scheme, state: 'static', label: '(all)', results: staticResults });

    const buttons = await page.$$('.css-button:not([disabled])');
    console.log(`[${scheme}] found ${buttons.length} enabled buttons`);

    for (let i = 0; i < buttons.length; i++) {
        const handle = buttons[i];
        const label = await handle.evaluate(el =>
            `${el.getAttribute('css-type')}/${el.getAttribute('css-size') || 'md'}`);

        // hover
        await handle.hover();
        let results = await new AxeBuilder({ page }).withTags(TAGS)
            .include('.css-button:not([disabled])')
            .analyze();
        allResults.push({ scheme, state: 'hover', label, index: i, results });

        // active (mouse down, still held)
        await handle.hover();
        await page.mouse.down();
        results = await new AxeBuilder({ page }).withTags(TAGS)
            .include('.css-button:not([disabled])')
            .analyze();
        allResults.push({ scheme, state: 'active', label, index: i, results });
        await page.mouse.up();

        // focus-visible (keyboard focus)
        await handle.evaluate(el => el.blur());
        await page.keyboard.press('Tab'); // best-effort; explicit focus() below is the reliable path
        await handle.evaluate(el => el.focus());
        results = await new AxeBuilder({ page }).withTags(TAGS)
            .include('.css-button:not([disabled])')
            .analyze();
        allResults.push({ scheme, state: 'focus-visible', label, index: i, results });
        await handle.evaluate(el => el.blur());
    }

    await context.close();
}

await browser.close();

writeFileSync(`${OUT}/audit.json`, JSON.stringify(allResults, null, 2));

const rows = allResults.map(r => {
    const v = r.results.violations;
    const nodeCount = v.reduce((n, x) => n + x.nodes.length, 0);
    return { ...r, ruleCount: v.length, nodeCount };
});

const summaryRows = rows.map(r =>
    `<tr>
      <td>${esc(r.scheme)}</td>
      <td>${esc(r.label)}</td>
      <td>${esc(r.state)}</td>
      <td>${r.ruleCount}</td>
      <td>${r.nodeCount}</td>
    </tr>`).join('\n');

const detailSections = rows.filter(r => r.ruleCount > 0).map(r => {
    const vRows = r.results.violations.map(v => {
        const nodeItems = v.nodes.map(n => {
            const selector = (n.target || []).join(', ');
            return `<li><code class="selector">${esc(selector)}</code><pre class="html-snip">${esc(n.html || '')}</pre><p>${esc(n.failureSummary || '')}</p></li>`;
        }).join('');
        return `<tr>
      <td><code>${esc(v.id)}</code></td>
      <td class="impact impact-${esc(v.impact || 'unknown')}">${esc(v.impact || '')}</td>
      <td>${esc(v.description)}</td>
      <td class="num">${v.nodes.length}</td>
      <td><ul class="node-list">${nodeItems}</ul></td>
    </tr>`;
    }).join('\n');

    return `<section>
  <h2 class="file-head">[${esc(r.scheme)}] ${esc(r.label)} — ${esc(r.state)}</h2>
  <div class="tbl-wrap">
    <table class="detail">
      <thead><tr><th>Rule ID</th><th>Impact</th><th>Description</th><th>Nodes</th><th>Selectors / HTML</th></tr></thead>
      <tbody>${vRows}</tbody>
    </table>
  </div>
</section>`;
}).join('\n');

writeFileSync(`${OUT}/audit.html`, `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Accessibility Report — light/dark × static/hover/active/focus states</title>
<style>
:root {
  --bg: #f5f6f8; --surface: #fff; --text: #1a1a1a; --text-sub: #555;
  --border: #d0d4da; --th-bg: #eef1f4; --ok: #1a7f37;
  --critical: #c0392b; --critical-bg: #fdecea;
  --serious: #d35400; --serious-bg: #fef3e8;
  --moderate: #b8860b; --moderate-bg: #fefadf;
  --minor: #27ae60; --minor-bg: #eafaf1;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0f1216; --surface: #1a1e26; --text: #e8eaf0; --text-sub: #9aa0ad;
    --border: #2e3340; --th-bg: #222630; --ok: #6bcf89;
    --critical: #ff6b6b; --critical-bg: #2d1515;
    --serious: #ff9966; --serious-bg: #2d1e0f;
    --moderate: #ffd966; --moderate-bg: #2a2410;
    --minor: #6bcf89; --minor-bg: #0f2117;
  }
}
* { box-sizing: border-box; }
body { margin: 0; padding: 24px 32px 64px; background: var(--bg); color: var(--text); font: 14px/1.6 system-ui, sans-serif; }
h1 { font-size: 22px; margin: 0 0 4px; }
.meta { color: var(--text-sub); font-size: 12px; margin: 0 0 32px; }
h2 { font-size: 16px; margin: 40px 0 10px; }
table { width: 100%; border-collapse: collapse; background: var(--surface); font-size: 13px; }
th, td { border: 1px solid var(--border); padding: 7px 10px; text-align: left; vertical-align: top; }
th { background: var(--th-bg); white-space: nowrap; }
td.num { text-align: right; white-space: nowrap; }
code { font-family: ui-monospace, monospace; background: var(--th-bg); padding: 1px 4px; border-radius: 3px; font-size: 12px; }
.impact { font-weight: bold; padding: 3px 8px; border-radius: 4px; white-space: nowrap; }
.impact-critical { color: var(--critical); background: var(--critical-bg); }
.impact-serious { color: var(--serious); background: var(--serious-bg); }
.impact-moderate { color: var(--moderate); background: var(--moderate-bg); }
.impact-minor { color: var(--minor); background: var(--minor-bg); }
section { margin-bottom: 56px; }
</style>
<h1>axe-core report — light/dark × static/hover/active/focus-visible</h1>
<p class="meta">Generated: ${new Date().toISOString()} — ${SCHEMES.length} schemes × (1 static scan + enabled buttons × 3 states)</p>
<h2>Summary</h2>
<table>
<thead><tr><th>Scheme</th><th>Button</th><th>State</th><th>Violation rules</th><th>Violating nodes</th></tr></thead>
<tbody>${summaryRows}</tbody>
</table>
${detailSections || '<p style="color:var(--ok);font-weight:bold;margin-top:24px">✓ No violations found in any scheme/state combination.</p>'}
`);

console.log('done: docs/audit.html, docs/audit.json');
