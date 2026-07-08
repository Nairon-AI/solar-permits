// Build the permit HTML for a project: projects/<name>/project.json -> out/<name>/permit.html
// Shared by render.js (PDF) and dev.js (hot reload). Also runs standalone:
//   node src/build.js [projects/<name>]
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, relative, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { coverSheet } from './sheets/cover.js';
import { roofPlanSheet } from './sheets/roofplan.js';
import { elevationSheet } from './sheets/elevation.js';
import { atlasCoverSheet } from './sheets/atlas/cover.js';
import { atlasSitePlanSheet } from './sheets/atlas/siteplan.js';
import { atlasElevationSheet } from './sheets/atlas/elevation.js';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const DEFAULT_PROJECT = 'projects/cape-coral-fl';

// Each theme is a house style: its own CSS + sheet templates.
// "atlas" is the standard style for all new permits; "canyon" is legacy,
// kept for the original bee-canyon-ca example.
const THEMES = {
  canyon: { css: 'src/styles.css', sheets: [coverSheet, roofPlanSheet, elevationSheet] },
  atlas: { css: 'src/themes/atlas.css', sheets: [atlasCoverSheet, atlasSitePlanSheet, atlasElevationSheet] },
};

export function buildHtml(projDirArg) {
  const projDir = resolve(root, projDirArg ?? DEFAULT_PROJECT);
  const outDir = resolve(root, 'out', basename(projDir));

  const data = JSON.parse(readFileSync(resolve(projDir, 'project.json'), 'utf8'));
  const theme = THEMES[data.theme ?? 'atlas'];
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
  return { htmlPath, outDir, count: sheets.length };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { htmlPath, count } = buildHtml(process.argv[2]);
  console.log(`Built ${count} sheets -> ${relative(root, htmlPath)}`);
}
