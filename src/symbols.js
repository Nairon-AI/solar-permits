// Reusable SVG symbols for plan-set drawings.
// The elevation and plan diagrams are schematic (NTS): they are assembled from
// these parametric glyphs and driven entirely by the project data.

import { esc } from './frame.js';

// --- generic helpers -------------------------------------------------------

// Multi-line SVG text. anchor: start | middle | end
export function textLines(lines, x, y, size, { anchor = 'start', lineHeight = 1.3, weight = 'normal', fill = '#000' } = {}) {
  const tspans = lines
    .map((l, i) => `<tspan x="${x}" ${i ? `dy="${size * lineHeight}"` : ''}>${esc(l)}</tspan>`)
    .join('');
  return `<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" font-weight="${weight}" fill="${fill}">${tspans}</text>`;
}

// Leader line through points [[x,y],...] with a small dot at the target end.
export function leader(points, { width = 1.2, dot = true } = {}) {
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ');
  const [tx, ty] = points[points.length - 1];
  return `<path d="${d}" fill="none" stroke="#000" stroke-width="${width}"/>` +
    (dot ? `<circle cx="${tx}" cy="${ty}" r="${width * 1.6}" fill="#000"/>` : '');
}

// Red dimension line with arrowheads at both ends and a label.
export function dimension(x1, y1, x2, y2, label, size, { labelOffset = null } = {}) {
  const horizontal = y1 === y2;
  const a = 3.2 * (size / 10); // arrowhead size scales with text
  let arrows;
  if (horizontal) {
    arrows = `<path d="M${x1},${y1} l${a},-${a / 2} v${a} z M${x2},${y2} l-${a},-${a / 2} v${a} z" fill="#c00"/>`;
  } else {
    arrows = `<path d="M${x1},${y1} l-${a / 2},${a} h${a} z M${x2},${y2} l-${a / 2},-${a} h${a} z" fill="#c00"/>`;
  }
  const lx = labelOffset ? labelOffset[0] : (horizontal ? (x1 + x2) / 2 : x1 + size * 0.75);
  const ly = labelOffset ? labelOffset[1] : (horizontal ? y1 - a : (y1 + y2) / 2 + size / 3);
  const rotate = horizontal ? '' : ` transform="rotate(-90 ${lx} ${ly})"`;
  return `
    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#c00" stroke-width="${size / 9}"/>
    ${arrows}
    <text x="${lx}" y="${ly}" font-size="${size}" fill="#c00" text-anchor="middle"${rotate}>${esc(label)}</text>`;
}

// Wall/section break mark (zigzag) centered on (x, y).
export function breakMark(x, y, s, vertical = false) {
  const d = vertical
    ? `M${x},${y - s * 2} l${-s},${s} l${s * 2},${s} l${-s},${s} l0,${s}`
    : `M${x - s * 2},${y} l${s},${-s} l${s},${s * 2} l${s},${-s} l${s},0`;
  return `<path d="${d}" fill="none" stroke="#000" stroke-width="1.4"/>`;
}

// North arrow: compass with a black-half needle, letter N.
export function northArrow(cx, cy, r) {
  return `
  <g stroke="#000" fill="none" stroke-width="${r * 0.045}">
    <circle cx="${cx}" cy="${cy}" r="${r}"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.82}"/>
    <path d="M${cx},${cy - r * 0.78} L${cx + r * 0.28},${cy + r * 0.6} L${cx},${cy + r * 0.35} Z" fill="#000"/>
    <path d="M${cx},${cy - r * 0.78} L${cx - r * 0.28},${cy + r * 0.6} L${cx},${cy + r * 0.35} Z" fill="#fff"/>
  </g>
  <text x="${cx}" y="${cy + r * 0.18}" font-size="${r * 0.62}" font-weight="bold" text-anchor="middle" fill="#000">N</text>`;
}

// Minimal north arrow: open triangle + N (atlas theme).
export function northArrowSimple(cx, cy, r) {
  return `
  <g>
    <path d="M${cx},${cy - r} L${cx + r * 0.55},${cy + r * 0.75} L${cx},${cy + r * 0.4} L${cx - r * 0.55},${cy + r * 0.75} Z"
          fill="none" stroke="#111" stroke-width="${r * 0.07}"/>
    <path d="M${cx},${cy - r} L${cx + r * 0.55},${cy + r * 0.75} L${cx},${cy + r * 0.4} Z" fill="#111"/>
    <text x="${cx}" y="${cy + r * 1.5}" font-size="${r * 0.65}" font-weight="bold" text-anchor="middle" fill="#111">N</text>
  </g>`;
}

// Ground line with hatching below (elevation view).
export function gradeLine(x1, x2, y, hatch = 14) {
  const ticks = [];
  for (let x = x1; x < x2; x += hatch) {
    ticks.push(`M${x + hatch * 0.7},${y} L${x},${y + hatch * 0.8}`);
  }
  return `
    <line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#111" stroke-width="2.2"/>
    <path d="${ticks.join(' ')}" stroke="#111" stroke-width="0.8" fill="none"/>`;
}

// --- equipment glyphs (elevation view) -------------------------------------

// Simplified Tesla "T" mark centered at (cx, cy), height h.
export function teslaMark(cx, cy, h) {
  const w = h * 0.95;
  const top = cy - h / 2;
  return `
  <g stroke="#444" fill="none">
    <path d="M${cx - w / 2},${top} Q${cx},${top + h * 0.34} ${cx + w / 2},${top}" stroke-width="${h * 0.14}"/>
    <line x1="${cx}" y1="${top + h * 0.2}" x2="${cx}" y2="${cy + h / 2}" stroke-width="${h * 0.15}"/>
  </g>`;
}

// Powerwall-style unit: rounded rectangle, Tesla mark, feet.
export function powerwall(x, y, w, h) {
  return `
  <g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w * 0.045}" fill="#fff" stroke="#000" stroke-width="1.6"/>
    ${teslaMark(x + w / 2, y + h * 0.2, h * 0.13)}
    <rect x="${x + w * 0.12}" y="${y + h}" width="${w * 0.1}" height="${h * 0.035}" fill="#fff" stroke="#000" stroke-width="1.2"/>
    <rect x="${x + w * 0.78}" y="${y + h}" width="${w * 0.1}" height="${h * 0.035}" fill="#fff" stroke="#000" stroke-width="1.2"/>
  </g>`;
}

// Expansion harness: U-shaped double conduit between two unit tops.
export function harness(x1, x2, yTop, dip) {
  const mid = (x1 + x2) / 2;
  const d = `M${x1},${yTop} C${x1},${yTop + dip} ${x2},${yTop + dip} ${x2},${yTop}`;
  return `
    <path d="${d}" fill="none" stroke="#000" stroke-width="5"/>
    <path d="${d}" fill="none" stroke="#fff" stroke-width="2.2"/>
    <rect x="${x1 - 3}" y="${yTop - 14}" width="6" height="16" fill="#fff" stroke="#000" stroke-width="1.2"/>
    <rect x="${x2 - 3}" y="${yTop - 14}" width="6" height="16" fill="#fff" stroke="#000" stroke-width="1.2"/>`;
}

// Small wall-mounted enclosure (disconnect, junction box...).
export function enclosure(x, y, w, h, { label = '', handle = false, circle = false } = {}) {
  return `
  <g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff" stroke="#000" stroke-width="1.5"/>
    ${label ? `<text x="${x + w / 2}" y="${y + h * 0.22}" font-size="${h * 0.13}" text-anchor="middle" fill="#000">${esc(label)}</text>` : ''}
    ${handle ? `<rect x="${x + w - 4}" y="${y + h * 0.3}" width="4" height="${h * 0.4}" fill="#000"/>` : ''}
    ${circle ? `<circle cx="${x + w / 2}" cy="${y + h / 2}" r="${Math.min(w, h) * 0.28}" fill="none" stroke="#000" stroke-width="1.4"/>` : ''}
  </g>`;
}

// Enphase IQ Battery 5P: wall-mounted, wider than tall, rounded corners,
// "e" badge and vent slots along the bottom.
export function iqBattery(x, y, w, h, tag = '') {
  const slots = [0.18, 0.34, 0.5, 0.66].map(f =>
    `<line x1="${x + w * f}" y1="${y + h * 0.88}" x2="${x + w * f + w * 0.1}" y2="${y + h * 0.88}" stroke="#111" stroke-width="1.6"/>`).join('');
  return `
  <g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h * 0.09}" fill="#fff" stroke="#111" stroke-width="1.7"/>
    <circle cx="${x + w * 0.5}" cy="${y + h * 0.42}" r="${h * 0.15}" fill="none" stroke="#111" stroke-width="1.4"/>
    <text x="${x + w * 0.5}" y="${y + h * 0.42 + h * 0.06}" font-size="${h * 0.19}" text-anchor="middle" fill="#111" font-style="italic">e</text>
    ${slots}
    ${tag ? `<text x="${x + w * 0.5}" y="${y - 6}" font-size="13" text-anchor="middle" fill="#111">${esc(tag)}</text>` : ''}
  </g>`;
}

// Enphase IQ System Controller 3G: tall narrow cabinet with door seam.
export function systemController(x, y, w, h) {
  return `
  <g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w * 0.06}" fill="#fff" stroke="#111" stroke-width="1.7"/>
    <line x1="${x + w * 0.16}" y1="${y + h * 0.06}" x2="${x + w * 0.16}" y2="${y + h * 0.94}" stroke="#111" stroke-width="1"/>
    <circle cx="${x + w * 0.55}" cy="${y + h * 0.14}" r="${w * 0.12}" fill="none" stroke="#111" stroke-width="1.2"/>
    <text x="${x + w * 0.55}" y="${y + h * 0.14 + w * 0.05}" font-size="${w * 0.16}" text-anchor="middle" fill="#111" font-style="italic">e</text>
    <rect x="${x + w * 0.32}" y="${y + h * 0.55}" width="${w * 0.45}" height="${h * 0.18}" fill="none" stroke="#111" stroke-width="1"/>
  </g>`;
}

// Utility meter: panel with round meter face.
export function utilityMeter(x, y, w, h) {
  const r = w * 0.34;
  return `
  <g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff" stroke="#000" stroke-width="1.5"/>
    <circle cx="${x + w / 2}" cy="${y + h * 0.3}" r="${r}" fill="#fff" stroke="#000" stroke-width="3"/>
    <circle cx="${x + w / 2}" cy="${y + h * 0.3}" r="${r * 0.62}" fill="none" stroke="#000" stroke-width="1"/>
    <text x="${x + w / 2}" y="${y + h * 0.28}" font-size="${r * 0.42}" text-anchor="middle">UTILITY</text>
    <text x="${x + w / 2}" y="${y + h * 0.28 + r * 0.5}" font-size="${r * 0.42}" text-anchor="middle">METER</text>
    <rect x="${x + w * 0.2}" y="${y + h * 0.62}" width="${w * 0.6}" height="${h * 0.3}" fill="none" stroke="#000" stroke-width="1"/>
  </g>`;
}
