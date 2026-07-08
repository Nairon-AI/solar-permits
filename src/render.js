// Render a permit plan set to PDF: projects/<name>/project.json -> out/<name>/permit.pdf
// Usage: node src/render.js [projects/<name>]
import { resolve, relative } from 'node:path';
import puppeteer from 'puppeteer-core';
import { buildHtml, root } from './build.js';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const { htmlPath, outDir, count } = buildHtml(process.argv[2]);

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1632, height: 1056 }); // 17in x 11in at 96dpi
await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0' });

await page.pdf({
  path: resolve(outDir, 'permit.pdf'),
  width: '17in',
  height: '11in',
  printBackground: true,
  margin: { top: 0, bottom: 0, left: 0, right: 0 },
});

// per-sheet PNGs for visual review
const els = await page.$$('.sheet');
for (let i = 0; i < els.length; i++) {
  await els[i].screenshot({ path: resolve(outDir, `sheet-${i}.png`) });
}

await browser.close();
console.log(`Rendered ${count} sheets -> ${relative(root, outDir)}/permit.pdf`);
