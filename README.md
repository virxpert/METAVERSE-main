# METAVERSE Platform

This repo contains the active browser-based metaverse sandbox app and its supporting runtime files. It is a static, client-side project that runs directly in the browser with progressive web app support and offline fallback.

## Current structure

- `index.html` — application shell and HUD
- `runtime-foundation.js` — runtime, input, sandbox logic, and UI behavior
- `service-worker.js` — offline caching and app-shell handling
- `manifest.json` — install metadata for the PWA
- `offline.html` — offline fallback page
- `vendor/three.0.128.0.min.js` — bundled Three.js runtime
- `archive/` — legacy docs and older project artifacts moved out of the live app root

## Local run

```bash
npm install
npm start
```

Then open:

- [http://127.0.0.1:8080/](http://127.0.0.1:8080/)
- [http://127.0.0.1:8080/index.html](http://127.0.0.1:8080/index.html)

## Development scripts

- `npm run dev` — serve the app on port 3000
- `npm start` — serve the app on port 8080
- `npm test` — lightweight verification pass

## Notes

- The project is designed as a static front-end; no backend is required.
- The service worker keeps the app shell cached for offline use.
- The app is tuned for local preview and deployment as a static site.

## Deployment

This project works well on static hosting providers such as:

- Netlify
- GitHub Pages
- Vercel
- Render

Upload the project folder as-is and serve the root directory.
