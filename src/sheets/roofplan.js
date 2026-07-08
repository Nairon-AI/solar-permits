// PV-2 ROOF PLAN & BOM: roof outline from site geometry (feet), equipment
// stack on the wall with zoom detail + callouts, legend, BOM tables.
import { sheet, figureLabel, esc } from '../frame.js';
import { textLines, leader, northArrow } from '../symbols.js';

const GREEN = '#009e3d';

function roofDrawing(roof) {
  const polys = roof.outlines.map(pts =>
    `<polygon points="${pts.map(p => p.join(',')).join(' ')}" fill="#fff" stroke="#000" stroke-width="0.45"/>`).join('');

  const vents =
    roof.ventsRound.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="0.8" fill="none" stroke="#000" stroke-width="0.3"/>`).join('') +
    roof.ventsRect.map(([x, y]) => `<rect x="${x}" y="${y}" width="4" height="2.6" fill="none" stroke="#000" stroke-width="0.3"/>`).join('');

  // small equipment stack on the wall
  const { x: wx, yTop } = roof.equipmentWall;
  const stack = roof.equipmentStack;
  const smallH = 3.5, smallW = 3.1;
  const small = stack.map((code, i) => {
    const y = yTop + i * (smallH + 0.15);
    return `<rect x="${wx + 0.3}" y="${y}" width="${smallW}" height="${smallH}" fill="#fff" stroke="${GREEN}" stroke-width="0.28"/>
      <text x="${wx + 0.3 + smallW / 2}" y="${y + smallH / 2}" font-size="1.5" fill="${GREEN}" text-anchor="middle" dominant-baseline="central" transform="rotate(-90 ${wx + 0.3 + smallW / 2} ${y + smallH / 2})">${esc(code)}</text>`;
  }).join('');
  const stackBottom = yTop + stack.length * (smallH + 0.15);

  // dashed zoom box + enlarged detail
  const zoom = `<rect x="${wx - 0.7}" y="${yTop - 1.5}" width="${smallW + 2}" height="${stackBottom - yTop + 3}" fill="none" stroke="#000" stroke-width="0.22" stroke-dasharray="1.2,0.8"/>`;
  const dx = 68, dTop = 50, dW = 6.8, dH = 5.4, dGap = 0.3;
  const detailBoxes = stack.map((code, i) => {
    const y = dTop + i * (dH + dGap);
    return `<rect x="${dx}" y="${y}" width="${dW}" height="${dH}" fill="#fff" stroke="${GREEN}" stroke-width="0.4"/>
      <text x="${dx + dW / 2}" y="${y + dH / 2}" font-size="2.7" fill="${GREEN}" text-anchor="middle" dominant-baseline="central" transform="rotate(-90 ${dx + dW / 2} ${y + dH / 2})">${esc(code)}</text>`;
  }).join('');
  const dBottom = dTop + stack.length * (dH + dGap);
  const connectors = `
    <line x1="${wx + smallW + 1.3}" y1="${yTop - 1.5}" x2="${dx}" y2="${dTop}" stroke="#000" stroke-width="0.22" stroke-dasharray="1.2,0.8"/>
    <line x1="${wx + smallW + 1.3}" y1="${stackBottom + 1.5}" x2="${dx}" y2="${dBottom}" stroke="#000" stroke-width="0.22" stroke-dasharray="1.2,0.8"/>
    <rect x="${dx - 0.6}" y="${dTop - 1.2}" width="${dW + 1.2}" height="${dBottom - dTop + 2.1}" fill="none" stroke="#000" stroke-width="0.22" stroke-dasharray="1.2,0.8"/>`;

  // callouts fan out to the right of the detail
  const labelYs = [40, 47.5, 54, 62.5, 74, 87];
  const callouts = roof.callouts.map((c, i) => {
    const boxCY = dTop + stack.indexOf(c.target) * (dH + dGap) + dH / 2;
    const ly = labelYs[i];
    return leader([[80.5, ly - 0.8], [77, ly - 0.8], [dx + dW + 0.4, boxCY]], { width: 0.22 }) +
      textLines(c.lines, 81.5, ly, 2.3);
  }).join('');

  return `
  <svg style="position:absolute; left:0.25in; top:0.45in; width:9.7in; height:9.55in" viewBox="-19 -10 152 142" preserveAspectRatio="xMidYMid meet">
    ${textLines([roof.backLabel], 40, -5, 3.4, { anchor: 'middle' })}
    ${polys}
    ${vents}
    ${small}${zoom}${detailBoxes}${connectors}${callouts}
    ${textLines([roof.frontLabel], 40, 118.5, 3.4, { anchor: 'middle' })}
    ${textLines(['BEE CANYON RD'], 40, 124, 3.4, { anchor: 'middle' })}
    ${northArrow(-11, 126, 7)}
  </svg>`;
}

export function roofPlanSheet(data) {
  const { roof, project } = data;

  const legendRows = data.legend.map(({ code, label }) => `
    <div style="display:flex; align-items:center; gap:6px; margin:3px 0">
      ${code === 'VENT'
        ? '<span style="flex:0 0 0.24in; height:0.15in; border:1px solid #000"></span>'
        : `<span style="flex:0 0 0.24in; text-align:center; border:1px solid ${GREEN}; color:${GREEN}; font-size:5.5pt; padding:1.5px 0">${esc(code)}</span>`}
      <span style="font-size:6.5pt">- ${esc(label)}</span>
    </div>`).join('');

  const content = `
  ${roofDrawing(roof)}

  <div class="abs box" style="left:10.15in; top:1.95in; width:2.6in; padding:5px 8px">${legendRows}</div>

  <table class="summary-table abs" style="left:9.85in; top:4.85in; width:3.45in">
    <tr><th>NEW EQUIPMENT SUMMARY</th></tr>
    ${data.newEquipmentSummary.map(s => `<tr><td>${esc(s)}</td></tr>`).join('')}
  </table>

  <div class="abs box" style="left:9.85in; top:6.75in; font-size:8pt; font-family:'Courier New',monospace; font-weight:bold">
    UTILITY METER NUMBER:- ${esc(project.utilityMeterNumber)}
  </div>

  <table class="grid-table abs" style="left:9.35in; top:7.25in; width:4.4in">
    <caption>BILL OF MATERIALS</caption>
    <tr><th style="width:1.05in">EQUIPMENT</th><th style="width:0.33in">QTY</th><th style="width:0.95in">PRODUCT CODE</th><th>DESCRIPTION</th></tr>
    ${data.bom.map(r => `
      <tr>
        <td class="c">${esc(r.equipment)}</td>
        <td class="c">${r.qty}</td>
        <td class="c">${esc(r.productCode)}</td>
        <td style="font-size:6.5pt">${esc(r.description)}</td>
      </tr>`).join('')}
  </table>

  <div class="abs" style="left:0.4in; top:9.95in">
    ${figureLabel('1', 'ROOF PLAN & BOM', 'PV-2', roof.scaleText)}
  </div>`;

  return sheet(data, { sheetName: 'ROOF PLAN & BOM', sheetNumber: 'PV-2', content });
}
