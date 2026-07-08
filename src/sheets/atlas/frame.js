// ATLAS house style frame: double border + full-width bottom title strip.
import { esc } from '../../frame.js';

export function atlasSheet(data, { sheetName, sheetNumber, content }) {
  const { project, systemInfo } = data;
  const revRows = Array.from({ length: 2 }, () => '<tr><td></td><td></td><td></td></tr>').join('');
  return `
  <div class="sheet">
    <div class="sheet-border"></div>
    <div class="sheet-border-inner"></div>
    <div class="content">${content}</div>
    <div class="title-strip">
      <div class="ts-cell" style="width:2.9in">
        <div class="ts-company">${esc(project.company)}</div>
        <div class="ts-sub">${esc(project.companyLicense)} &nbsp;|&nbsp; JOB # ${esc(project.jobNumber)}</div>
      </div>
      <div class="ts-cell" style="width:3in">
        <div class="ts-label">PROJECT</div>
        <div class="ts-value">${esc(project.address)}</div>
        <div class="ts-info" style="margin-top:2px">AHJ: ${esc(project.ahjName)}<br>UTILITY: ${esc(project.utility)} &nbsp; METER # ${esc(project.utilityMeterNumber)}</div>
      </div>
      <div class="ts-cell" style="width:3.1in">
        <div class="ts-label">SYSTEM</div>
        <div class="ts-info">${systemInfo.map(esc).join('<br>')}</div>
      </div>
      <div class="ts-cell" style="width:2.5in">
        <div class="ts-label">REVISIONS</div>
        <table class="ts-revtable">
          <tr><th style="width:56%">DESCRIPTION</th><th style="width:26%">DATE</th><th>REV</th></tr>
          ${revRows}
        </table>
      </div>
      <div class="ts-cell" style="width:1.7in">
        <div class="ts-label">DATE</div>
        <div class="ts-value">${esc(project.date)}</div>
        <div class="ts-label" style="margin-top:4px">SHEET SIZE</div>
        <div class="ts-value">${esc(project.sheetSize)}</div>
      </div>
      <div class="ts-cell" style="flex:1">
        <div class="ts-label">SHEET NAME</div>
        <div class="ts-sheetname">${esc(sheetName)}</div>
      </div>
      <div class="ts-cell" style="width:1.35in; background:#eef2f7">
        <div class="ts-sheetnum">${esc(sheetNumber)}</div>
      </div>
    </div>
  </div>`;
}

export function atlasFigureLabel(num, title, scale) {
  return `
  <div class="figure-label">
    <div class="fl-circle">${esc(num)}</div>
    <div class="fl-text">
      <div class="t">${esc(title)}</div>
      <div class="s">SCALE: ${esc(scale)}</div>
    </div>
  </div>`;
}
