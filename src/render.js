// Render a permit plan set: projects/<name>/project.json -> HTML sheets -> PDF.
// Usage: node src/render.js [projects/<name>]   (default: projects/bee-canyon-ca)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, relative, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { coverSheet } from './sheets/cover.js';
import { roofPlanSheet } from './sheets/roofplan.js';
import { elevationSheet } from './sheets/elevation.js';
import { atlasCoverSheet } from './sheets/atlas/cover.js';
import { atlasSitePlanSheet } from './sheets/atlas/siteplan.js';
import { atlasElevationSheet } from './sheets/atlas/elevation.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// Each theme is a house style: its own CSS + sheet templates.
const THEMES = {
  canyon: { css: 'src/styles.css', sheets: [coverSheet, roofPlanSheet, elevationSheet] },
  atlas: { css: 'src/themes/atlas.css', sheets: [atlasCoverSheet, atlasSitePlanSheet, atlasElevationSheet] },
};

const projDir = resolve(root, process.argv[2] ?? 'projects/bee-canyon-ca');
const outDir = resolve(root, 'out', basename(projDir));

const data = JSON.parse(readFileSync(resolve(projDir, 'project.json'), 'utf8'));
const theme = THEMES[data.theme ?? 'canyon'];
data.assetsRel = relative(outDir, resolve(projDir, 'assets'));

const css = readFileSync(resolve(root, theme.css), 'utf8');
const sheets = theme.sheets.map(build => build(data));

const html = `<!doctype html>
<html>
<head><meta charset="utf-8"><title>Permit Plan Set</title><style>${css}</style></head>
<body>${sheets.join('\n')}</body>
</html>`;

mkdirSync(outDir, { recursive: true });
const htmlPath = resolve(outDir, 'permit.html');
writeFileSync(htmlPath, html);

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
console.log(`Rendered ${sheets.length} sheets -> ${relative(root, outDir)}/permit.pdf`);
