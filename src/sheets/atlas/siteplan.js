// ES-1 SITE / ROOF PLAN & BOM (atlas style): hip roof with ridge lines,
// pool screen enclosure, property line, equipment stack with zoom detail.
import { esc } from '../../frame.js';
import { atlasSheet, atlasFigureLabel } from './frame.js';
import { textLines, leader, northArrowSimple } from '../../symbols.js';

const STEEL = '#2563eb';

function siteDrawing(site, streetName) {
  const pl = site.propertyLine;
  const m = site.mainRoof;
  const g = site.garage;
  const pc = site.poolCage;
  const dw = site.driveway;

  // hip roof: outline + ridge + diagonals to ridge ends
  const mainRoof = `
    <rect x="${m.x}" y="${m.y}" width="${m.w}" height="${m.h}" fill="#fff" stroke="#111" stroke-width="0.5"/>
    <line x1="${m.ridge.x1}" y1="${m.ridge.y}" x2="${m.ridge.x2}" y2="${m.ridge.y}" stroke="#111" stroke-width="0.3"/>
    <line x1="${m.x}" y1="${m.y}" x2="${m.ridge.x1}" y2="${m.ridge.y}" stroke="#111" stroke-width="0.3"/>
    <line x1="${m.x}" y1="${m.y + m.h}" x2="${m.ridge.x1}" y2="${m.ridge.y}" stroke="#111" stroke-width="0.3"/>
    <line x1="${m.x + m.w}" y1="${m.y}" x2="${m.ridge.x2}" y2="${m.ridge.y}" stroke="#111" stroke-width="0.3"/>
    <line x1="${m.x + m.w}" y1="${m.y + m.h}" x2="${m.ridge.x2}" y2="${m.ridge.y}" stroke="#111" stroke-width="0.3"/>`;

  const garage = `
    <rect x="${g.x}" y="${g.y}" width="${g.w}" height="${g.h}" fill="#fff" stroke="#111" stroke-width="0.5"/>
    <line x1="${g.x + g.w / 2}" y1="${g.y + 1}" x2="${g.x + g.w / 2}" y2="${g.y + g.h - 1}" stroke="#111" stroke-width="0.3"/>`;

  // pool screen enclosure: thin grid
  const gridLines = [];
  for (let x = pc.x + 4; x < pc.x + pc.w; x += 4) gridLines.push(`M${x},${pc.y} L${x},${pc.y + pc.h}`);
  for (let y = pc.y + 4; y < pc.y + pc.h; y += 4) gridLines.push(`M${pc.x},${y} L${pc.x + pc.w},${y}`);
  const poolCage = `
    <rect x="${pc.x}" y="${pc.y}" width="${pc.w}" height="${pc.h}" fill="#fff" stroke="#111" stroke-width="0.45"/>
    <path d="${gridLines.join(' ')}" stroke="#9ca3af" stroke-width="0.12" fill="none"/>
    <rect x="${pc.x + pc.w / 2 - 15}" y="${pc.y + pc.h / 2 - 1.8}" width="30" height="3.6" fill="#fff" opacity="0.9"/>
    ${textLines(['(E) POOL SCREEN ENCLOSURE'], pc.x + pc.w / 2, pc.y + pc.h / 2 + 0.8, 2, { anchor: 'middle' })}`;

  const driveway = `
    <rect x="${dw.x}" y="${dw.y}" width="${dw.w}" height="${dw.h}" fill="none" stroke="#6b7280" stroke-width="0.25"/>
    ${textLines(['(E) DRIVEWAY'], dw.x + dw.w / 2, dw.y + dw.h / 2 + 0.7, 1.8, { anchor: 'middle' })}`;

  const property = `
    <rect x="${pl.x}" y="${pl.y}" width="${pl.w}" height="${pl.h}" fill="none" stroke="#111" stroke-width="0.3" stroke-dasharray="3,1.5,0.6,1.5"/>
    ${textLines(['PROPERTY LINE'], pl.x + 2, pl.y + pl.h - 2, 2)}`;

  // equipment stack on east wall + zoom detail with callouts
  const { x: wx, yTop } = site.equipmentWall;
  const stack = site.equipmentStack;
  const smallH = 2.9, smallW = 2.8;
  const small = stack.map((code, i) => {
    const y = yTop + i * (smallH + 0.15);
    return `<rect x="${wx + 0.3}" y="${y}" width="${smallW}" height="${smallH}" fill="#fff" stroke="${STEEL}" stroke-width="0.26"/>
      <text x="${wx + 0.3 + smallW / 2}" y="${y + smallH / 2}" font-size="1.3" fill="${STEEL}" text-anchor="middle" dominant-baseline="central" transform="rotate(-90 ${wx + 0.3 + smallW / 2} ${y + smallH / 2})">${esc(code)}</text>`;
  }).join('');
  const stackBottom = yTop + stack.length * (smallH + 0.15);
  const zoom = `<rect x="${wx - 0.6}" y="${yTop - 1.3}" width="${smallW + 1.9}" height="${stackBottom - yTop + 2.6}" fill="none" stroke="#111" stroke-width="0.2" stroke-dasharray="1.1,0.7"/>`;

  const dx = 78, dTop = 34, dW = 6, dH = 4.7, dGap = 0.3;
  const detailBoxes = stack.map((code, i) => {
    const y = dTop + i * (dH + dGap);
    return `<rect x="${dx}" y="${y}" width="${dW}" height="${dH}" fill="#fff" stroke="${STEEL}" stroke-width="0.38"/>
      <text x="${dx + dW / 2}" y="${y + dH / 2}" font-size="2.3" fill="${STEEL}" text-anchor="middle" dominant-baseline="central" transform="rotate(-90 ${dx + dW / 2} ${y + dH / 2})">${esc(code)}</text>`;
  }).join('');
  const dBottom = dTop + stack.length * (dH + dGap);
  const connectors = `
    <line x1="${wx + smallW + 1.3}" y1="${yTop - 1.3}" x2="${dx}" y2="${dTop}" stroke="#111" stroke-width="0.2" stroke-dasharray="1.1,0.7"/>
    <line x1="${wx + smallW + 1.3}" y1="${stackBottom + 1.3}" x2="${dx}" y2="${dBottom}" stroke="#111" stroke-width="0.2" stroke-dasharray="1.1,0.7"/>
    <rect x="${dx - 0.5}" y="${dTop - 1}" width="${dW + 1}" height="${dBottom - dTop + 1.8}" fill="none" stroke="#111" stroke-width="0.2" stroke-dasharray="1.1,0.7"/>`;

  const labelYs = [26.5, 33.5, 41, 49.5, 58.5, 67.5, 76.5];
  const callouts = site.callouts.map((c, i) => {
    const boxCY = dTop + stack.indexOf(c.target) * (dH + dGap) + dH / 2;
    const ly = labelYs[i];
    return leader([[86.5, ly - 0.7], [83.5, ly - 0.7], [dx + dW + 0.4, boxCY]], { width: 0.2 }) +
      textLines(c.lines, 87.5, ly, 2.1);
  }).join('');

  return `
  <svg style="position:absolute; left:0.25in; top:0.35in; width:9.55in; height:8.55in" viewBox="-16 -13 150 134" preserveAspectRatio="xMidYMid meet">
    ${textLines([site.canalLabel], 33, -8.5, 3, { anchor: 'middle' })}
    <line x1="${pl.x - 4}" y1="-6" x2="${pl.x + pl.w + 4}" y2="-6" stroke="#60a5fa" stroke-width="0.4" stroke-dasharray="2,1"/>
    ${property}
    ${poolCage}
    ${mainRoof}
    ${garage}
    ${driveway}
    ${small}${zoom}${detailBoxes}${connectors}${callouts}
    ${textLines([site.frontLabel], 33, 108, 3, { anchor: 'middle' })}
    ${textLines([streetName], 33, 116.5, 3, { anchor: 'middle', weight: 'bold' })}
    ${northArrowSimple(-10, 118, 5)}
  </svg>`;
}

export function atlasSitePlanSheet(data) {
  const { site, project } = data;

  const legendRows = data.legend.map(({ code, label }) => `
    <div style="display:flex; align-items:center; gap:6px; margin:2.5px 0">
      ${code === 'POOL'
        ? '<span style="flex:0 0 0.3in; height:0.14in; border:1px solid #111; background:repeating-linear-gradient(90deg,#fff,#fff 2px,#d1d5db 2px,#d1d5db 3px)"></span>'
        : `<span style="flex:0 0 0.3in; text-align:center; border:1px solid ${'#2563eb'}; color:${'#2563eb'}; font-size:5.5pt; font-weight:700; padding:1.5px 0">${esc(code)}</span>`}
      <span style="font-size:6.5pt">${esc(label)}</span>
    </div>`).join('');

  const content = `
  ${siteDrawing(site, project.streetName)}

  <div class="abs" style="left:10.1in; top:0.25in; width:3.15in">
    <div class="hd-bar">LEGEND</div>
    <div class="panel" style="border-top:none"><div class="body">${legendRows}</div></div>
  </div>

  <div class="abs" style="left:13.5in; top:0.25in; width:3in">
    <div class="hd-bar">NEW EQUIPMENT SUMMARY</div>
    <div class="summary-list" style="border-top:none">
      ${data.newEquipmentSummary.map(s => `<div class="row">${esc(s)}</div>`).join('')}
    </div>
  </div>

  <table class="grid-table abs" style="left:10.1in; top:3.4in; width:6.4in">
    <tr><th colspan="4" style="font-size:8.5pt">BILL OF MATERIALS</th></tr>
    <tr><th style="width:1.25in">EQUIPMENT</th><th style="width:0.4in">QTY</th><th style="width:1.35in">PRODUCT CODE</th><th>DESCRIPTION</th></tr>
    ${data.bom.map(r => `
      <tr>
        <td class="c" style="font-weight:700">${esc(r.equipment)}</td>
        <td class="c">${r.qty}</td>
        <td class="c">${esc(r.productCode)}</td>
        <td>${esc(r.description)}</td>
      </tr>`).join('')}
  </table>

  <div class="abs panel" style="left:10.1in; top:6.15in; padding:4px 8px; font-size:8.5pt; font-weight:700; letter-spacing:0.05em">
    UTILITY METER # ${esc(project.utilityMeterNumber)} &nbsp;&mdash;&nbsp; ${esc(project.utility)}
  </div>

  <div class="abs" style="left:0.4in; top:8.95in">
    ${atlasFigureLabel('1', 'SITE / ROOF PLAN & BOM', site.scaleText)}
  </div>`;

  return atlasSheet(data, { sheetName: 'SITE / ROOF PLAN & BOM', sheetNumber: 'ES-1', content });
}
