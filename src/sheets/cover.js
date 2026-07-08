// PV-0 COVER PAGE: scope of work, codes, notes, sheet index, maps.
import { sheet, figureLabel, esc } from '../frame.js';

export function coverSheet(data) {
  const { project } = data;

  // pin position on the vicinity map, from GPS + the map's bounding box
  const bb = project.vicinityBbox;
  const pinX = ((project.gps.lng - bb.west) / (bb.east - bb.west) * 100).toFixed(1);
  const pinY = ((bb.north - project.gps.lat) / (bb.north - bb.south) * 100).toFixed(1);

  const content = `
  <!-- column 1: scope, codes, general notes -->
  <div class="abs" style="left:0.35in; top:0.28in; width:5.15in">
    <div class="note-heading">SCOPE OF WORK:</div>
    <div class="note-text">${esc(data.scopeOfWork)}</div>
  </div>

  <div class="abs box" style="left:0.35in; top:1.32in; width:3.5in; padding:5px 7px">
    <div class="note-heading" style="text-decoration:none; border-bottom:1.5px solid #000; margin:-5px -7px 4px; padding:2px 7px;">GOVERNING CODES</div>
    <div class="codes-list">${project.governingCodes.map(esc).join('<br>')}</div>
    <div style="font-size:9pt; margin-top:8px"><b>AHJ NAME</b>:&nbsp; ${esc(project.ahjName)}</div>
  </div>

  <div class="abs" style="left:0.35in; top:3.6in; width:5.15in">
    <div class="note-heading">GENERAL NOTES:</div>
    <div class="note-text no-justify">
      ${data.generalNotes.map((n, i) => `${i + 1}. ${esc(n)}`).join('<br>')}
    </div>
  </div>

  <!-- column 2: system rating, warning, sheet index, battery notes -->
  <div class="abs box" style="left:5.85in; top:1.3in; width:2.1in; padding:0">
    <div style="font-size:10pt; font-weight:bold; padding:4px 7px; border-bottom:1.5px solid #000">(N) SYSTEM RATING</div>
    <div style="font-size:10pt; padding:6px 7px">${esc(project.systemRatingKwac)}</div>
  </div>

  <div class="abs warn-box" style="left:5.85in; top:2.6in; width:2.15in">${esc(data.batteryWarning)}</div>

  <table class="grid-table abs" style="left:5.95in; top:3.55in; width:2.85in">
    <caption>SHEET INDEX</caption>
    <tbody>
      ${data.sheetIndex.map(([num, name]) =>
        `<tr><td class="c" style="width:0.75in">${esc(num)}</td><td class="c">${esc(name)}</td></tr>`).join('')}
    </tbody>
  </table>

  <div class="abs" style="left:5.6in; top:6.55in; width:3.6in">
    <div class="note-heading">BATTERY STORAGE SYSTEM NOTES</div>
    <div class="note-text no-justify" style="padding-left:0.25in">
      ${data.batteryStorageNotes.map(esc).join('<br><br>')}
    </div>
  </div>

  <!-- column 3: equipment summary, vicinity maps -->
  <table class="summary-table abs" style="left:9.25in; top:0.28in; width:3.2in">
    <tr><th>NEW EQUIPMENT SUMMARY</th></tr>
    ${data.newEquipmentSummary.map(s => `<tr><td>${esc(s)}</td></tr>`).join('')}
  </table>

  <div class="abs" style="left:10.25in; top:2.15in; width:2.7in">
    <div class="vicinity-heading">VICINITY</div>
    <div class="gps-line">GPS LOCATION : ${project.gps.lat}, ${project.gps.lng}</div>
  </div>

  <div class="abs" style="left:10.35in; top:2.62in; width:2.5in; height:3.1in">
    <div style="position:absolute; top:-1px; left:-1px; z-index:1; background:#fff; border:1px solid #000; font-size:7.5pt; padding:1px 4px">PROJECT SITE</div>
    <img class="map-img" src="${data.assetsRel}/house-photo.png">
  </div>
  <div class="abs" style="left:10.35in; top:5.85in; width:2.5in">
    ${figureLabel('1', 'HOUSE PHOTO', 'PV-0', 'NTS')}
  </div>

  <div class="abs" style="left:10.35in; top:6.8in; width:2.5in; height:2.9in">
    <div style="position:absolute; top:-1px; left:-1px; z-index:1; background:#fff; border:1px solid #000; font-size:7.5pt; padding:1px 4px">PROJECT SITE</div>
    <svg style="position:absolute; z-index:1; left:calc(${pinX}% - 11px); top:calc(${pinY}% - 30px); width:22px; height:30px" viewBox="0 0 20 28">
      <path d="M10,0 C4.5,0 0,4.5 0,10 C0,17 10,28 10,28 C10,28 20,17 20,10 C20,4.5 15.5,0 10,0 Z" fill="#e33"/>
      <circle cx="10" cy="10" r="4" fill="#a11"/>
    </svg>
    <img class="map-img" src="${data.assetsRel}/vicinity-map.png">
  </div>
  <div class="abs" style="left:10.35in; top:9.83in; width:2.5in">
    ${figureLabel('2', 'VICINITY MAP', 'PV-0', 'NTS')}
  </div>`;

  return sheet(data, { sheetName: 'COVER PAGE', sheetNumber: 'PV-0', content });
}
