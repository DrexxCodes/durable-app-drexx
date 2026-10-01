# Changelog


## 1.3.0 – Brand palette matched to the landing page

Colours were sampled from the brand screenshot (the earlier violet `#6d28d9` was too light and blue).

| Token | Old | New | Role |
|---|---|---|---|
| `--brand` | `#6d28d9` | `#3c0b5b` | primary buttons, active nav, links |
| `--brand-strong` / `--brand-deep` | `#5b21b6` / `#2e1065` | `#2c0845` / `#220636` | hover, gradient start |
| `--brand-bright` (new) | – | `#7535dc` | gradient end, focus ring, spinner, highlights |
| `--gold` (new) | – | `#d4a72c` | accent: badge, fund-wallet / sign-up CTAs |
| `--canvas` / `--brand-soft` | `#f7f5fc` / `#f3edff` | `#f8f5fc` / `#f3ebfa` | page background / tints |
| `--ink` | `#1a1230` | `#1f0a33` | text |

- Balance card and landing hero use the same diagonal gradient as the brand page (deep plum top-left to bright violet
  bottom-right) with soft decorative circles; "Fund wallet" and "Create free account" use the gold accent.
- Landing hero is now a dark gradient panel with a gold "Airtime · Data · Bills" badge.
- Bootstrap `--bs-primary` / link / info colours, spinners, password eye icon, Education tile (gold) updated.
- PWA: `theme_color`, browser `themeColor` and the offline page now use `#3c0b5b`.

## Landing page
- **NEW `src/styles/landing.css`**: styles for the Hero / Services / About / Benefits components (they had no CSS). Glassmorphism on the nav, service cards, hero chips and footer, over soft colour orbs, using the existing `--brand`, `--gold`, `--glass` tokens. Mobile-first, `prefers-reduced-motion` respected, opaque fallback when `backdrop-filter` is unsupported.
- `src/styles/theme.css`: removed the old `.landing*` / `.feature-*` / `.reason*` block (moved to landing.css, rest of file untouched). `.pill` and `.btn-outline-light-glass` now live in landing.css.
- `src/app/layout.jsx`: imports `landing.css`.
- `landing/Landing.jsx`: now composes `Hero`, `Services`, `About`, `Benefits` (the old inline sections are gone); store links moved into the footer. `REASONS` in `constants/landing.js` is no longer used by the page (left in place).
- `components/About.jsx`, `Benefits.jsx`: images are `loading="lazy"`, `decoding="async"`, have width/height (no layout shift) and request 640px / q70 instead of 800px / q80 (smaller payload).
- `components/Services.jsx`: the decorative arrow was a `<button>` that did nothing; it is now an `aria-hidden` span.

## PWA install / launch

## 1.2.0 – Login fan-out reduction

- `src/lib/http.js` (new), installed in `AppRoot`: identical in-flight GETs now share one network request (login bootstrap +
  page effects + React StrictMode double effects). Catalog data only (settings, use-case, network, plans, categories, billers,
  FAQs, manual banks) is also reused for 30 s. Balances, transactions and notifications are never cached; any non-GET request
  clears the window; the cache key includes the auth token.
- `loadUser` (`Data/Actions/AuthActions.js`): the 16 requests fired at once after login are now staged. Dashboard data
  (balance, settings, use-case, notifications, recent activity) goes first; the remaining catalogs follow three at a time, most-used
  first (`src/lib/taskPool.js`, new). Same requests, same store updates, no data removed.
- `Products` hub: removed 6 transaction-history requests per visit. Every product page already loads its own history on mount.

## 1.1.0 – Purple theme, persistent shell, PWA

### Theme
- Brand colour switched from blue to **purple** (`#6d28d9`, derived from the logo). All legacy blue/teal tokens
  (`--dark-blue`, `--light-blue`, gradients, Bootstrap `--bs-primary`/`--bs-info`, spinners, password eye icon) now resolve
  to the purple palette; neutrals are tinted purple. Balance card uses a violet gradient.
- Product tile accents re-picked to sit well next to purple (violet, fuchsia, indigo, rose, teal, green, amber).

### Fixes (dev-log errors)
- `legacy.css`: `summary::webkit-details-marker` -> `summary::-webkit-details-marker` (the Turbopack "Parsing CSS source code failed" warning).
- `Data/Context.js`: `useSelector(state => state)` returned the root store, triggering react-redux's
  "returned the root state" warning and re-rendering on *every* store change. It now selects only the 29 slices the
  context exposes, with `shallowEqual`.

### Layout
- The shell (sidebar, top bar, bottom nav, support button, footer) now lives in `src/app/layout.jsx` via `AppEntry`,
  so it is mounted once and **never remounts on route change**; only the page (`RouteView` -> `PageRouter`) swaps.
- `PageRouter` no longer shows the full-screen loader while a background `loadUser()` refresh runs for an already
  signed-in user (that used to cover the nav). Full-screen loader is kept for first boot only.
- Bottom nav is now ~98 % opaque with a stronger blur and a soft shadow, so page content no longer shows through it.
- Top bar respects iOS/Android safe-area insets in standalone mode.

### Footer
- "Developed and Maintained by Drexx Technologies" shown at the foot of every app page and every guest page
  (landing, login, register, privacy, terms…).

### PWA
- `src/app/manifest.js` (name from `REACT_APP_NAME`, standalone display, purple theme colour, shortcuts for airtime, data and wallet).
- Icons generated from the supplied logo: `public/icons/` (192, 512, maskable-512, apple-touch-icon, favicon).
- `public/sw.js` + `public/offline.html`: conservative worker – caches only `/_next/static` and icons, shows an offline page
  when navigation fails, **never** caches API calls, HTML or non-GET requests. Registered in production builds only.
- Install UX (`components/pwa/*`, `hooks/usePwaInstall.js`, `lib/pwa.js`):
  - **Android:** banner "<App> feels better in a mobile experience." with **Install App** (native prompt).
  - **iOS:** same banner with **Add to Home Screen**, which opens the iOS share sheet (where that action lives) and falls
    back to a 3-step guide.
  - **Desktop (Chrome/Edge):** an install icon in the top bar. The browser's own address-bar install icon also appears.
  - Hidden once installed / running standalone; closing the banner snoozes it for 7 days.
- `next.config.mjs`: no-cache headers for `/sw.js`.

## 1.0.0 – Next.js migration + minimalist UI makeover

### Framework
- Migrated from Create React App + react-router to **Next.js (App Router)**.
- One optional catch-all route (`src/app/[[...slug]]/page.jsx`) resolves every original URL
  (`/dashboard`, `/products/airtime`, `/wallets/referral`, `/products/cgwallet/:id` …) through
  `src/config/routes.js`, a direct port of the old `PageRender` rules (same auth redirects).
  Pages are code-split with `next/dynamic`.
- The app renders client-side only (same as the CRA build): it relies on the localStorage token and the Redux store.
- `src/lib/router.js`: tiny shim (`Link`, `useNavigate`, `useParams`, `useLocation`, `useSearchParams`) so all
  feature modules keep their logic untouched – only the import path changed.
- `next.config.mjs` exposes every `REACT_APP_*` variable to the browser, so your existing `.env` works unchanged.
- **Backend untouched.** All API calls, Redux actions/reducers and axios config are the originals.

### UI / layout
- New shell: collapsible left sidebar (desktop), glass top bar, **bottom tab bar + "More" sheet (mobile)**.
- New dashboard: balance hero card, 3 stat tiles, quick actions, light calendar, recent transactions.
- Products hub, transactions summary tiles, error page, success/error dialogs, empty states restyled.
- Support links (WhatsApp / email / socials) collapsed into a single help button.
- New minimalist public landing page (replaces the 15 marketing templates) and auth card layout.
- `src/styles/theme.css` re-skins the legacy bootstrap classes (`btn-primary1`, `form-control`, tables,
  pagination, modals …) so the forms/pages that were not rewritten match the new look.
- **Avatar:** unique, deterministic **DiceBear** SVG per user (seeded by user id/email), generated locally
  (no network request). Used in the top bar and Settings. An uploaded avatar always wins.

### Fixes / cleanups
- `redux-thunk` default import → named import; `createStore` → `legacy_createStore` (Redux 5 / thunk 3); devtools only in dev.
- Removed global `*:focus { outline: none; box-shadow: none }` (broke keyboard accessibility) and the global
  `* { font-size: 14px }` reset that forced every element to 14px.
- `useValidation` (Data/useFetch.js): no longer throws `Cannot read properties of undefined (reading 'forEach')`
  when a request fails without a server response (offline / timeout).
- Dashboard "be informed" pop-up: the 2s `setTimeout` is now cleared on unmount.
- Logged-in `/` redirect uses `replace` so the Back button no longer bounces to `/`.
- Removed a leftover `console.log` in the logout/idle handler.
- Modals no longer depend on reactstrap/bootstrap JS (React 19 safe); OTP input is dependency-free.

### Dependencies
- Removed: `react-scripts`, `react-router-dom`, `reactstrap`, `jquery`, `aos`, `react-document-meta`,
  `react18-otp-input`, `recharts`, `framer-motion`, `typewriter-effect`, `react-scroll`, `uuid`,
  `tailwindcss`, testing libs, bootstrap JS.
- Added: `next`, `@dicebear/core`, `@dicebear/collection`.
- Kept: React, Redux stack, axios, moment, react-calendar, react-paginate, react-to-print, react-idle-timer,
  react-paystack, flutterwave-react-v3, react-toastify, react-spinners, react-icons, bootstrap (CSS only).
- All versions use `latest`; run `npm install` once and commit the generated lockfile to pin them.
- `.npmrc` sets `legacy-peer-deps=true` because some payment SDKs still declare React 18 peer ranges.
