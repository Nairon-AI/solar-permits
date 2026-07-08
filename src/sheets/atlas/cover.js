// ES-0 COVER PAGE (atlas style): header banner, project summary table,
// scope, codes, ESS notes, sheet index, side-by-side maps.
import { esc } from '../../frame.js';
import { atlasSheet, atlasFigureLabel } from './frame.js';

export function atlasCoverSheet(data) {
  const { project } = data;

  const bb = project.vicinityBbox;
  const pinX = ((project.gps.lng - bb.west) / (bb.east - bb.west) * 100).toFixed(1);
  const pinY = ((bb.north - project.gps.lat) / (bb.north - bb.south) * 100).toFixed(1);

  const content = `
  <div class="abs" style="left:0.35in; top:0.22in; width:9in">
    <div class="doc-title">ENERGY STORAGE SYSTEM &mdash; PERMIT PLAN SET</div>
    <div class="doc-subtitle">${esc(project.address)}</div>
  </div>

  <div class="abs" style="left:0.35in; top:1.2in; width:4.6in">
    <div class="hd-bar">PROJECT SUMMARY</div>
    <table class="kv-table">
      ${data.projectSummary.map(([k, v]) => `<tr><td class="k">${esc(k)}</td><td>${esc(v)}</td></tr>`).join('')}
    </table>
  </div>

  <div class="abs panel" style="left:0.35in; top:2.95in; width:4.6in">
    <div class="hd-bar">SCOPE OF WORK</div>
    <div class="body note-text">${esc(data.scopeOfWork)}</div>
  </div>

  <div class="abs panel" style="left:0.35in; top:4.75in; width:4.6in">
    <div class="hd-bar">GOVERNING CODES</div>
    <div class="body codes-list">${project.governingCodes.map(esc).join('<br>')}</div>
  </div>

  <div class="abs warn-box" style="left:0.35in; top:6.35in; width:4.6in">${esc(data.warnings[0])}</div>
  <div class="abs warn-box" style="left:0.35in; top:6.95in; width:4.6in">${esc(data.warnings[1])}</div>

  <div class="abs" style="left:5.3in; top:1.2in; width:4.25in">
    <div class="hd-bar">ENERGY STORAGE SYSTEM NOTES</div>
    <div class="panel" style="border-top:none"><div class="body note-text">
      ${data.essNotes.map((n, i) => `${i + 1}. ${esc(n)}`).join('<br>')}
    </div></div>
  </div>

  <table class="grid-table abs" style="left:5.3in; top:6in; width:3.1in">
    <tr><th colspan="2">SHEET INDEX</th></tr>
    ${data.sheetIndex.map(([num, name]) =>
      `<tr><td class="c" style="width:0.7in; font-weight:700">${esc(num)}</td><td>${esc(name)}</td></tr>`).join('')}
  </table>

  <div class="abs" style="left:5.3in; top:8.35in; width:3.1in; height:0.95in; border:1.5px dashed var(--rule); display:flex; align-items:center; justify-content:center; font-size:7pt; letter-spacing:0.15em; color:var(--rule)">PE STAMP</div>

  <div class="abs" style="left:9.95in; top:0.22in; width:3.25in">
    <div class="hd-bar">NEW EQUIPMENT SUMMARY</div>
    <div class="summary-list" style="border-top:none">
      ${data.newEquipmentSummary.map(s => `<div class="row">${esc(s)}</div>`).join('')}
    </div>
  </div>

  <div class="abs" style="left:13.55in; top:0.22in; width:2.95in; height:1.75in; border:1.5px dashed var(--rule); display:flex; align-items:center; justify-content:center; font-size:7pt; letter-spacing:0.15em; color:var(--rule)">CONTRACTOR STAMP</div>

  <div class="abs" style="left:9.95in; top:2.35in; width:6.55in; text-align:center; font-size:9pt; font-weight:600; letter-spacing:0.06em">
    VICINITY &mdash; GPS LOCATION: ${project.gps.lat}, ${project.gps.lng}
  </div>

  <div class="abs" style="left:9.95in; top:2.72in; width:3.15in; height:5.35in">
    <div class="map-tag">PROJECT SITE</div>
    <img class="map-img" src="${data.assetsRel}/house-photo.png">
  </div>
  <div class="abs" style="left:9.95in; top:8.3in">
    ${atlasFigureLabel('1', 'SITE PHOTO', 'NTS')}
  </div>

  <div class="abs" style="left:13.35in; top:2.72in; width:3.15in; height:5.35in">
    <div class="map-tag">PROJECT SITE</div>
    <svg style="position:absolute; z-index:1; left:calc(${pinX}% - 11px); top:calc(${pinY}% - 30px); width:22px; height:30px" viewBox="0 0 20 28">
      <path d="M10,0 C4.5,0 0,4.5 0,10 C0,17 10,28 10,28 C10,28 20,17 20,10 C20,4.5 15.5,0 10,0 Z" fill="#e33"/>
      <circle cx="10" cy="10" r="4" fill="#a11"/>
    </svg>
    <img class="map-img" src="${data.assetsRel}/vicinity-map.png">
  </div>
  <div class="abs" style="left:13.35in; top:8.3in">
    ${atlasFigureLabel('2', 'VICINITY MAP', 'NTS')}
  </div>`;

  return atlasSheet(data, { sheetName: 'COVER PAGE', sheetNumber: 'ES-0', content });
}
