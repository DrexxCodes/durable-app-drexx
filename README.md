# Durable VTU – user app (Next.js)

```bash
cp .env.example .env     # paste your existing REACT_APP_* values
npm install
npm run dev              # http://localhost:3000  (API: http://localhost:9092 in dev)
npm run build && npm start
```

- Production API URL comes from `REACT_APP_BASE_URL` (same variables as the old CRA app).
- Logo: set `REACT_APP_IMAGE_URL` (e.g. `/logo.png`, included in `/public`).

## Structure
```
src/
  app/            Next entry (layout + catch-all page)
  components/     layout (shell, sidebar, bottom nav), ui primitives, dashboard tiles, feedback, landing
  config/         route registry (URL -> page)
  constants/      navigation + landing content
  hooks/          useAvatar, useGreeting, useIdleLogout, useDocumentTitle
  lib/            router shim, dicebear
  styles/         legacy.css (old helper classes) + theme.css (minimalist theme)
  views/          app/ (logged-in pages) and public/ (login, register …)
  features/       original feature modules (products, wallets, transactions, settings …)
  Data/ Utils/    original Redux store, actions, reducers, helpers
```

## PWA
- Test installability on a production build: `npm run build && npm start` (service worker is disabled in `next dev`).
  `localhost` counts as a secure context; real devices need HTTPS.
- Icons live in `public/icons/` (replace them to rebrand). Theme colour: `src/app/manifest.js` and `viewport` in `src/app/layout.jsx`.
