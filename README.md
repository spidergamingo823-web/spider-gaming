# Spider Gaming 2.0

React (Vite) mod portal with separate **user** and **admin** areas.

## Structure
- `/login`, `/signup` — normal player accounts (no role picker)
- `/admin-login` — separate fixed admin login (demo: `admin` / `admin123`)
- `/admin` — admin dashboard: Upload mod, Manage mods, **Categories** (add categories like Maps, Cars, Buses)
- `/` — user Browse page:
  1. Shows a grid of **categories** first
  2. Click a category → shows its mods, with a **version filter** dropdown to narrow down by version
  3. Click a mod card for full details (images, YouTube preview, source link, download)

## Run it
```bash
npm install
npm run dev
```
Then open the printed local URL (usually http://localhost:5173).

## Build for production
```bash
npm run build
npm run preview
```

## Notes
- Data (users & mods) is stored in the browser's `localStorage` for this demo — no backend yet.
  Swap `src/context/AuthContext.jsx` for real API calls when you're ready to add a server/database.
- Styling: Bootstrap 5 (via CDN in `index.html`) + custom dark theme in `src/index.css`.
- Fully responsive — grid and forms adapt down to mobile widths.
