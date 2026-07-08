// ES-2 EQUIPMENT ELEVATION (atlas style): east wall, wall-mounted Enphase
// equipment on a grade line, clearance dimensions, callouts top and bottom.
import { atlasSheet, atlasFigureLabel } from './frame.js';
import { textLines, leader, dimension, breakMark, gradeLine, iqBattery, systemController, enclosure, utilityMeter } from '../../symbols.js';

function elevationDrawing(ev) {
  const L = ev.labels;

  // wall face with break marks, grade line below
  const structure = `
    <path d="M120,60 L120,620 M1480,60 L1480,620" fill="none" stroke="#111" stroke-width="1.8"/>
    <line x1="120" y1="60" x2="1480" y2="60" stroke="#111" stroke-width="1.8"/>
    ${breakMark(120, 340, 9, true)}
    ${breakMark(1480, 340, 9, true)}
    ${gradeLine(75, 1525, 620)}
    ${textLines(L.grade, 1530, 626, 15)}`;

  const units = `
    ${utilityMeter(170, 300, 70, 160)}
    ${enclosure(280, 280, 90, 200)}
    ${systemController(430, 250, 90, 290)}
    ${iqBattery(580, 330, 225, 150)}
    ${iqBattery(850, 330, 225, 150)}
    ${enclosure(1140, 350, 65, 95, { handle: true })}
    ${enclosure(1250, 355, 55, 75, { circle: true })}
    ${enclosure(1360, 360, 45, 65)}`;

  const dims = `
    ${dimension(808, 405, 847, 405, '12"', 16)}
    ${dimension(610, 484, 610, 616, '30"', 16)}
    ${dimension(880, 484, 880, 616, '30"', 16)}`;

  const callouts = `
    ${textLines(L.utilityMeter, 100, 165, 17)}
    ${leader([[110, 172], [205, 296]], { width: 1.1 })}

    ${textLines(L.controller, 390, 105, 17)}
    ${leader([[385, 122], [475, 246]], { width: 1.1 })}

    ${textLines(L.b1, 640, 180, 17)}
    ${leader([[635, 198], [660, 326]], { width: 1.1 })}

    ${textLines(L.msp, 190, 680, 17)}
    ${leader([[185, 665], [325, 482]], { width: 1.1 })}

    ${textLines(L.b2, 700, 680, 17)}
    ${leader([[695, 665], [962, 482]], { width: 1.1 })}

    ${textLines(L.acd, 1010, 690, 17)}
    ${leader([[1005, 673], [1172, 447]], { width: 1.1 })}

    ${textLines(L.rsd, 1240, 655, 17)}
    ${leader([[1235, 638], [1277, 432]], { width: 1.1 })}

    ${textLines(L.gateway, 1320, 190, 17)}
    ${leader([[1315, 205], [1382, 358]], { width: 1.1 })}`;

  return `
  <svg style="position:absolute; left:0.35in; top:1.05in; width:16in; height:7.7in" viewBox="0 0 1620 780" preserveAspectRatio="xMidYMin meet">
    ${structure}
    ${units}
    ${dims}
    ${callouts}
  </svg>`;
}

export function atlasElevationSheet(data) {
  const ev = data.elevation;

  const noteBoxes = `
    <div class="abs panel" style="left:0.35in; top:0.15in; width:4in"><div class="body note-text">${ev.notes[0]}</div></div>
    <div class="abs panel" style="left:4.6in; top:0.15in; width:4.6in"><div class="body note-text">${ev.notes[1]}</div></div>
    <div class="abs panel" style="left:9.45in; top:0.15in; width:5.6in"><div class="body note-text">${ev.notes[2]}</div></div>`;

  const content = `
  ${noteBoxes}
  ${elevationDrawing(ev)}
  <div class="abs" style="left:0.4in; top:8.95in">
    ${atlasFigureLabel('1', ev.title, ev.scaleText)}
  </div>`;

  return atlasSheet(data, { sheetName: 'EQUIPMENT ELEVATION', sheetNumber: 'ES-2', content });
}
