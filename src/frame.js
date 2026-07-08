// Shared sheet frame: border, title block, stamp box, figure labels.
// Every sheet is the same 17x11 frame with different content inside.

export function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function titleBlock(data, sheetName, sheetNumber) {
  const { project, systemInfo } = data;
  const revRows = Array.from({ length: 3 }, () => '<tr><td></td><td></td><td></td></tr>').join('');
  return `
  <div class="title-block">
    <div class="tb-box" style="height:1.35in"></div>
    <div class="tb-box" style="height:1.9in"></div>
    <div class="tb-box">
      <div class="tb-heading">SYSTEM INFO</div>
      ${systemInfo.map(s => `<div class="tb-sysinfo">${esc(s)}</div>`).join('')}
      <div class="tb-sysinfo" style="height:0.18in"></div>
      <div class="tb-sysinfo" style="height:0.18in"></div>
    </div>
    <div class="tb-box">
      <div class="tb-heading">REVISIONS</div>
      <table class="tb-revtable">
        <tr><th style="width:58%">DESCRIPTION</th><th style="width:26%">DATE</th><th>REV</th></tr>
        ${revRows}
      </table>
    </div>
    <div class="tb-box" style="flex:1; min-height:0.6in">
      <div class="tb-heading" style="text-align:left; padding-left:3px">PROJECT NAME &amp; ADDRESS</div>
    </div>
    <div class="tb-box"><div class="tb-value" style="font-size:7pt; padding:3px 2px">DATE: ${esc(project.date)}</div></div>
    <div class="tb-box">
      <div class="tb-heading">SHEET NAME</div>
      <div class="tb-value med">${esc(sheetName)}</div>
    </div>
    <div class="tb-box">
      <div class="tb-heading">SHEET SIZE</div>
      <div class="tb-value">${esc(project.sheetSize.replace(' 11"', '<br>11"')).replace('&lt;br&gt;', '<br>')}</div>
    </div>
    <div class="tb-box">
      <div class="tb-heading">SHEET NUMBER</div>
      <div class="tb-value big">${esc(sheetNumber)}</div>
    </div>
  </div>`;
}

export function figureLabel(num, title, sheetRef, scale) {
  return `
  <div class="figure-label">
    <div class="fl-num"><div class="n">${esc(num)}</div><div class="ref">${esc(sheetRef)}</div></div>
    <div class="fl-title">
      <div class="t">${esc(title)}</div>
      <div class="s">SCALE:<span class="scale-val">${esc(scale)}</span></div>
    </div>
  </div>`;
}

export function sheet(data, { sheetName, sheetNumber, content, stampBox = true }) {
  return `
  <div class="sheet">
    <div class="sheet-border"></div>
    <div class="content">
      ${content}
      ${stampBox ? '<div class="stamp-box"></div>' : ''}
    </div>
    ${titleBlock(data, sheetName, sheetNumber)}
  </div>`;
}
