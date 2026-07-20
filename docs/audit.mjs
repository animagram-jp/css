import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { globSync } from 'glob';
import { mkdirSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const OUT = 'docs';
mkdirSync(OUT, { recursive: true });

const files = globSync('index.html');
if (files.length === 0) {
    console.error('No HTML files found (expected ./index.html)');
    process.exit(1);
}

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

const esc = s => String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const browser = await chromium.launch();
const context = await browser.newContext();
const allResults = [];

for (const file of files) {
    const url = pathToFileURL(path.resolve(file)).href;
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'load' });

    const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    const nodeCount = results.violations.reduce((n, v) => n + v.nodes.length, 0);

    const base = path.basename(file, '.html');
    writeFileSync(`${OUT}/audit-${base}.json`, JSON.stringify(results, null, 2));
    allResults.push({ file, base, ruleCount: results.violations.length, nodeCount, violations: results.violations });

    await page.close();
}

await context.close();
await browser.close();

const summaryRows = allResults.map(s =>
    `<tr>
      <td>${esc(s.file)}</td>
      <td>${s.ruleCount}</td>
      <td>${s.nodeCount}</td>
      <td><a class="dl-link" href="audit-${s.base}.json" download>audit-${s.base}.json ↓</a></td>
    </tr>`).join('\n');

const detailSections = allResults.map(s => {
    if (s.violations.length === 0) {
        return `<section>
  <h2 class="file-ok">✓ ${esc(s.file)}</h2>
  <p>No violations found. <a class="dl-link" href="audit-${s.base}.json" download>JSON ↓</a></p>
</section>`;
    }

    const vRows = s.violations.map(v => {
        const nodeItems = v.nodes.map(n => {
            const selector = (n.target || []).join(', ');
            return `<li><code class="selector">${esc(selector)}</code><pre class="html-snip">${esc(n.html || '')}</pre></li>`;
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
  <h2 class="file-head">
    ${esc(s.file)} — ${s.ruleCount} rules / ${s.nodeCount} nodes
    <a class="dl-link" href="audit-${s.base}.json" download>JSON ↓</a>
  </h2>
  <div class="tbl-wrap">
    <table class="detail">
      <thead><tr>
        <th>Rule ID</th><th>Impact</th><th>Description</th><th>Nodes</th><th>Selectors / HTML</th>
      </tr></thead>
      <tbody>${vRows}</tbody>
    </table>
  </div>
</section>`;
}).join('\n');

writeFileSync(`${OUT}/audit.html`, `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Accessibility Report — axe-core</title>
<style>
:root {
  --bg:          #f5f6f8;
  --surface:     #ffffff;
  --text:        #1a1a1a;
  --text-sub:    #555555;
  --border:      #d0d4da;
  --th-bg:       #eef1f4;
  --code-bg:     #f0f2f5;
  --link:        #0066cc;
  --ok:          #1a7f37;
  --critical:    #c0392b; --critical-bg: #fdecea;
  --serious:     #d35400; --serious-bg:  #fef3e8;
  --moderate:    #b8860b; --moderate-bg: #fefadf;
  --minor:       #27ae60; --minor-bg:    #eafaf1;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg:          #0f1216;
    --surface:     #1a1e26;
    --text:        #e8eaf0;
    --text-sub:    #9aa0ad;
    --border:      #2e3340;
    --th-bg:       #222630;
    --code-bg:     #222630;
    --link:        #4da6ff;
    --ok:          #6bcf89;
    --critical:    #ff6b6b; --critical-bg: #2d1515;
    --serious:     #ff9966; --serious-bg:  #2d1e0f;
    --moderate:    #ffd966; --moderate-bg: #2a2410;
    --minor:       #6bcf89; --minor-bg:    #0f2117;
  }
}
* { box-sizing: border-box; }
body { margin: 0; padding: 24px 32px 64px; background: var(--bg); color: var(--text); font: 14px/1.6 system-ui, sans-serif; }
h1 { font-size: 22px; margin: 0 0 4px; }
.meta { color: var(--text-sub); font-size: 12px; margin: 0 0 32px; }
h2 { font-size: 16px; margin: 40px 0 10px; display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
.file-ok { color: var(--ok); }
.dl-link { display: inline-block; font-size: 12px; font-weight: normal; color: var(--link); text-decoration: none; border: 1px solid currentColor; padding: 1px 7px; border-radius: 4px; }
.dl-link:hover { opacity: .75; }
.tbl-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; background: var(--surface); font-size: 13px; }
th, td { border: 1px solid var(--border); padding: 7px 10px; text-align: left; vertical-align: top; }
th { background: var(--th-bg); white-space: nowrap; }
td.num { text-align: right; white-space: nowrap; }
code { font-family: ui-monospace, monospace; background: var(--code-bg); padding: 1px 4px; border-radius: 3px; font-size: 12px; }
pre.html-snip { margin: 4px 0 0; font-size: 11px; white-space: pre-wrap; word-break: break-all; background: var(--code-bg); padding: 4px 6px; border-radius: 3px; }
ul.node-list { margin: 0; padding: 0 0 0 16px; }
ul.node-list li { margin-bottom: 8px; }
.selector { display: block; margin-bottom: 2px; }
.impact { font-weight: bold; white-space: nowrap; padding: 3px 8px; border-radius: 4px; }
.impact-critical { color: var(--critical); background: var(--critical-bg); }
.impact-serious  { color: var(--serious);  background: var(--serious-bg);  }
.impact-moderate { color: var(--moderate); background: var(--moderate-bg); }
.impact-minor    { color: var(--minor);    background: var(--minor-bg);    }
section { margin-bottom: 56px; }
</style>

<h1>axe-core report (WCAG 2.2 A/AA)</h1>
<p class="meta">Generated: ${new Date().toISOString()}</p>

<h2>Summary</h2>
<div class="tbl-wrap">
<table>
<thead><tr><th>File</th><th>Violation rules</th><th>Violating nodes</th><th>JSON</th></tr></thead>
<tbody>
${summaryRows}
</tbody>
</table>
</div>

${detailSections}
`);
