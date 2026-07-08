# Hive Startup

This repository is a static permit plan-set generator. For Hive previews, serve
the checked-in generated Cape Coral permit HTML from `out/cape-coral-fl`.

Use this command from the repository root:

```bash
node .hive-runtime/preview-control.cjs start --port 4317 --cwd . --health-path /permit.html -- python3 -m http.server 4317 --bind 0.0.0.0 --directory out/cape-coral-fl
```

Verified profile:

- Command: `python3 -m http.server 4317 --bind 0.0.0.0 --directory out/cape-coral-fl`
- Cwd: repository root
- Port: `4317`
- Health path: `/permit.html`
- Expected public page title: `Permit Plan Set`
- Expected app shell: static permit plan set with three `.sheet` elements

Do not run `npm run render` for preview startup. Rendering requires a local
Chrome executable path configured in `src/render.js`; the committed `out/`
artifacts are the deterministic preview surface.
