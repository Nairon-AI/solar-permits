# Solar Permit Plan-Set Generator

Generates AHJ-ready permit plan sets (ANSI B 11"×17" PDF) from a single JSON
data file per property. HTML/CSS/SVG templates rendered to vector PDF via
headless Chrome.

## Generate a permit

```bash
npm install
node src/render.js projects/<name>     # e.g. projects/cape-coral-fl
```

Output lands in `out/<name>/`: `permit.pdf`, `permit.html` (open in a browser
to preview while editing templates), and `sheet-N.png` (one screenshot per
sheet — look at these to verify your work).

## Repo layout

```
projects/<name>/packet.md       info packet from the installer (the input brief)
projects/<name>/project.json    ALL data for the permit: address, AHJ, codes,
                                equipment, BOM, site geometry (feet), labels
projects/<name>/assets/         site photo + vicinity map images
src/render.js                   entry point; maps theme -> sheet templates
src/themes/atlas.css            "atlas" house style — THE standard for all new
src/sheets/atlas/*.js           permits (bottom title strip, condensed, navy)
src/frame.js, src/styles.css    "canyon" house style — LEGACY, kept only for
src/sheets/*.js                 the original bee-canyon-ca example
src/symbols.js                  shared SVG symbol library (equipment glyphs,
                                leaders, dimensions, north arrows, grade line)
```

## Workflow: new permit from an info packet

1. Save the packet as `projects/<name>/packet.md`.
2. Fetch map assets from the packet's GPS (no API key needed):
   - satellite: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=<w>,<s>,<e>,<n>&bboxSR=4326&size=700,780&format=png&f=image`
   - streets: same URL with `World_Street_Map`
   Save as `assets/house-photo.png` and `assets/vicinity-map.png`; record the
   vicinity bbox in `project.json` (`project.vicinityBbox`) — the map pin is
   computed from it.
3. Write `project.json` — copy `projects/cape-coral-fl/project.json` as the
   starting point (it matches the atlas templates). Site geometry is
   polygons/rects in **feet** — trace the roof from the satellite photo.
4. Use the **atlas** house style for all new permits (it is the default when
   `theme` is omitted). Do not use `canyon` — it is legacy. Sheet layouts
   (equipment placement, callout positions) are adjusted per property inside
   `src/sheets/atlas/*.js`; reuse `src/symbols.js` for equipment glyphs and
   add new equipment there, not inline.
5. Render, then **read the `out/<name>/sheet-N.png` screenshots** and fix
   overlaps/collisions before calling it done. Compare against the packet:
   every equipment item should appear in the summary, BOM, plan callouts, and
   elevation.

## Conventions

- All permit text is UPPERCASE (drafting convention). `(E)` = existing,
  `(N)` = new.
- Drawings are schematic (`SCALE: NTS`) except plan sheets, which state a
  nominal scale. Red is reserved for warnings and clearance dimensions.
- Elevation drawings are assembled from parametric glyphs in `src/symbols.js`
  (`powerwall`, `iqBattery`, `systemController`, `enclosure`, `utilityMeter`,
  `dimension`, `leader`, ...). Add new equipment there, not inline.
