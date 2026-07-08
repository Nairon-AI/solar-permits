// Hot-reload dev server for iterating on sheet templates.
//   node src/dev.js [projects/<name>]     -> http://localhost:4173
// Watches src/ and the project folder; on save it rebuilds the HTML (in a
// fresh child process, so template edits always take effect) and reloads the
// browser via server-sent events. PDF output stays in render.js.
import { createServer } from 'node:http';
import { watch, readFileSync, existsSync, statSync } from 'node:fs';
import { execFileSync, spawn } from 'node:child_process';
import { resolve, relative, basename, extname, normalize, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const projArg = process.argv[2] ?? 'projects/cape-coral-fl';
const PORT = 4173;

const entry = `/out/${basename(resolve(root, projArg))}/permit.html`;
let clients = [];

function build() {
  try {
    execFileSync(process.execPath, [resolve(root, 'src/build.js'), projArg], { stdio: 'inherit' });
    return true;
  } catch {
    return false; // template error already printed; keep serving the last good build
  }
}

const MIME = {
  '.html': 'text/html', '.png': 'image/png', '.css': 'text/css',
  '.js': 'text/javascript', '.json': 'application/json', '.pdf': 'application/pdf',
};

createServer((req, res) => {
  if (req.url === '/__reload') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
    res.write('\n');
    clients.push(res);
    req.on('close', () => { clients = clients.filter(c => c !== res); });
    return;
  }
  const urlPath = req.url === '/' ? entry : decodeURIComponent(req.url.split('?')[0]);
  const filePath = normalize(join(root, urlPath));
  if (!filePath.startsWith(root) || !existsSync(filePath) || statSync(filePath).isDirectory()) {
    res.writeHead(404);
    res.end('not found');
    return;
  }
  let body = readFileSync(filePath);
  if (filePath.endsWith('permit.html')) {
    body = body.toString().replace('</body>',
      `<script>new EventSource('/__reload').onmessage = () => location.reload()</script></body>`);
  }
  res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
  res.end(body);
}).listen(PORT, () => {
  console.log(`Dev server: http://localhost:${PORT}  (watching src/ and ${projArg})`);
  if (process.platform === 'darwin') spawn('open', [`http://localhost:${PORT}`]);
});

let timer;
for (const dir of ['src', projArg]) {
  watch(resolve(root, dir), { recursive: true }, (evt, file) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      console.log(`↻ ${file ?? 'change'} — rebuilding`);
      if (build()) for (const c of clients) c.write('data: reload\n\n');
    }, 120);
  });
}

build();
