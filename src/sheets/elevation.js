// PV-2A EQUIPMENT ELEVATION: schematic wall elevation assembled from the
// equipment symbol library, with callout leaders and red clearance dimensions.
import { sheet, figureLabel } from '../frame.js';
import { textLines, leader, dimension, breakMark, powerwall, harness, enclosure, utilityMeter } from '../symbols.js';

function elevationDrawing(ev) {
  const L = ev.labels;

  // wall + deck
  const structure = `
    <rect x="205" y="148" width="915" height="22" fill="#fff" stroke="#000" stroke-width="1.8"/>
    <path d="M255,170 L255,640 L1085,640 L1085,170" fill="none" stroke="#000" stroke-width="1.8"/>
    ${breakMark(255, 215, 9, true)}
    ${breakMark(1085, 215, 9, true)}`;

  // powerwalls raised 1FT off grade, harness between them
  const units = `
    ${powerwall(330, 380, 150, 210)}
    ${powerwall(545, 380, 150, 210)}
    ${harness(462, 552, 382, 72)}
    ${enclosure(790, 430, 62, 88, { label: 'EATON', handle: true })}
    ${enclosure(890, 452, 40, 62)}
    ${enclosure(955, 442, 52, 74, { circle: true })}
    ${utilityMeter(1028, 420, 62, 145)}
    ${enclosure(1092, 400, 70, 165)}`;

  const dims = `
    ${dimension(484, 545, 541, 545, '1FT', 17)}
    ${dimension(352, 600, 352, 638, '1FT', 17)}
    ${dimension(567, 600, 567, 638, '1FT', 17)}`;

  const callouts = `
    ${textLines(L.harness, 300, 390, 17, { anchor: 'end' })}
    ${leader([[308, 398], [400, 398], [500, 438]], { width: 1.1 })}

    ${textLines(L.disconnectSwitch, 555, 268, 17)}
    ${leader([[550, 285], [512, 310], [505, 425]], { width: 1.1 })}

    ${textLines(L.box, 902, 335, 17, { anchor: 'middle' })}
    ${leader([[905, 345], [908, 450]], { width: 1.1 })}

    ${textLines(L.utilityMeter, 1122, 362, 17)}
    ${leader([[1117, 368], [1060, 424]], { width: 1.1 })}

    ${textLines(L.msp, 1122, 688, 17)}
    ${leader([[1117, 680], [1130, 567]], { width: 1.1 })}

    ${textLines(L.backupSwitch, 1000, 742, 17)}
    ${leader([[995, 733], [1059, 567]], { width: 1.1 })}

    ${textLines(L.rsd, 940, 800, 17)}
    ${leader([[935, 790], [981, 518]], { width: 1.1 })}

    ${textLines(L.pvc, 858, 852, 17)}
    ${leader([[853, 843], [910, 516]], { width: 1.1 })}

    ${textLines(L.acd, 620, 895, 17)}
    ${leader([[615, 887], [821, 520]], { width: 1.1 })}

    ${textLines(L.exp, 430, 690, 17, { anchor: 'end' })}
    ${leader([[436, 684], [405, 599]], { width: 1.1 })}

    ${textLines(L.pw, 610, 775, 17, { anchor: 'end' })}
    ${leader([[616, 769], [620, 599]], { width: 1.1 })}`;

  return `
  <svg style="position:absolute; left:0.3in; top:1.25in; width:13.9in; height:9.35in" viewBox="0 0 1420 945" preserveAspectRatio="xMidYMin meet">
    ${textLines(ev.title, 660, 88, 40, { anchor: 'middle', lineHeight: 1.2 })}
    ${structure}
    ${units}
    ${dims}
    ${callouts}
  </svg>`;
}

export function elevationSheet(data) {
  const ev = data.elevation;

  const noteBoxes = `
    <div class="abs box" style="left:0.35in; top:0.22in; width:2.35in; font-size:7.5pt; line-height:1.35">${ev.notes[0]}</div>
    <div class="abs box" style="left:2.95in; top:0.22in; width:2.35in; font-size:7.5pt; line-height:1.35">${ev.notes[1]}</div>
    <div class="abs box" style="left:5.55in; top:0.22in; width:3.3in; font-size:7.5pt; line-height:1.35">${ev.notes[2]}</div>`;

  const content = `
  ${noteBoxes}
  ${elevationDrawing(ev)}
  <div class="abs" style="left:0.35in; top:9.95in">
    ${figureLabel('1', 'EQUIPMENT ELEVATION', 'PV-2A', ev.scaleText)}
  </div>`;

  return sheet(data, { sheetName: 'EQUIPMENT ELEVATION', sheetNumber: 'PV-2A', content });
}
