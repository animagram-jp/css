import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { globSync } from 'glob';
import { mkdirSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const OUT = 'audit';
mkdirSync(OUT, { recursive: true });

const files = globSync('examples/*.html');
if (files.length === 0) {
    console.error('No HTML files under ./examples/');
    process.exit(1);
}

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

const browser = await chromium.launch();
const summary = [];

for (const file of files) {
    const url = pathToFileURL(path.resolve(file)).href;
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'load' });

    const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    const count = results.violations.reduce((n, v) => n + v.nodes.length, 0);

    const base = path.basename(file, '.html');
    writeFileSync(`${OUT}/${base}.json`, JSON.stringify(results, null, 2));
    summary.push({ file, violations: results.violations.length, nodes: count });

    await page.close();
}

await browser.close();

const rows = summary.map(s =>
    `<tr><td><a href="${path.basename(s.file, '.html')}.json">${s.file}</a></td>
       <td>${s.violations}</td><td>${s.nodes}</td></tr>`).join('\n');
writeFileSync(`${OUT}/index.html`, `<!doctype html><meta charset="utf-8">
<title>accessibility report</title>
<h1>axe-core report (WCAG 2.2 A/AA)</h1>
<p>Generated: ${new Date().toISOString()}</p>
<table border="1" cellpadding="6">
<tr><th>file</th><th>violation rules</th><th>violating nodes</th></tr>
${rows}
</table>`);
