import axios from "axios";

/**
 * Request layer installed once on the shared axios instance, so every existing
 * action (`axios.get(...)`) benefits without being edited.
 *
 *  1. In-flight de-duplication - identical GETs issued at the same time (login
 *     bootstrap + page effects, React StrictMode's double effects in dev) share one
 *     network request.
 *  2. Short freshness window - ONLY for catalog data that rarely changes (plans,
 *     networks, settings, FAQs ...). Balances, transactions and notifications are
 *     never cached, and any non-GET request (purchase, update ...) clears the window.
 *
 * The cache key includes the Authorization header, so users never see each other's data.
 */

const CATALOG_TTL_MS = 30 * 1000;
const MAX_ENTRIES = 100;
const CATALOG =
  /^\/api\/v1\/(settings|usecase|network|education|cables|electricity|category|biller|data|faqs|user\/manage-manual-bank)(\/|\?|$)/;

const pathOf = url => String(url || "").replace(/^https?:\/\/[^/]+/i, "");
const ttlFor = url => (CATALOG.test(pathOf(url)) ? CATALOG_TTL_MS : 0);

export function installHttpLayer(instance = axios) {
  if (instance.__httpLayerInstalled || typeof instance.getAdapter !== "function") return;
  instance.__httpLayerInstalled = true;

  const baseAdapter = instance.getAdapter(instance.defaults.adapter);
  const inflight = new Map();
  const fresh = new Map();

  // A bare 304 is not a usable answer for the app (axios rejects it, the action's catch
  // swallows it and the store stays empty). Browsers can surface one when their cached copy
  // is revalidated. If that happens, ask once more under a different URL so the browser
  // sends no validators and the server must return the real body.
  const fetchFresh = config =>
    baseAdapter(config).catch(err => {
      const status = err?.response?.status ?? err?.status;
      if (status !== 304 || config.__retried304) throw err;
      return baseAdapter({
        ...config,
        params: { ...(config.params || {}), _r: Date.now() },
        __retried304: true,
      });
    });

  const keyOf = config => {
    const auth = config.headers?.get?.("Authorization") ?? config.headers?.Authorization ?? "";
    return [config.baseURL || "", config.url, JSON.stringify(config.params || {}), auth].join("|");
  };

  const remember = (key, snapshot, ttl) => {
    if (fresh.size >= MAX_ENTRIES) fresh.delete(fresh.keys().next().value);
    fresh.set(key, { snapshot, at: Date.now(), ttl });
  };

  // Snapshots hold the *raw* response (body still an unparsed string), so each
  // caller gets its own copy and axios parses it separately: nothing is shared.
  const copy = (snapshot, config) => ({ ...snapshot, config });

  instance.defaults.adapter = config => {
    const method = String(config.method || "get").toLowerCase();

    if (method !== "get") {
      fresh.clear(); // something changed on the server: don't serve a stale window
      return baseAdapter(config);
    }
    if (config.signal || config.cancelToken || (config.responseType && config.responseType !== "json")) {
      return baseAdapter(config);
    }

    const key = keyOf(config);

    const hit = fresh.get(key);
    if (hit && Date.now() - hit.at < hit.ttl) return Promise.resolve(copy(hit.snapshot, config));

    const running = inflight.get(key);
    if (running) return running.then(snapshot => copy(snapshot, config));

    const ttl = ttlFor(config.url);
    const shared = fetchFresh(config).then(response => ({ ...response }));
    inflight.set(key, shared);

    const settle = () => inflight.delete(key);
    shared.then(
      snapshot => {
        settle();
        if (ttl && snapshot.status === 200) remember(key, snapshot, ttl);
      },
      settle
    );

    return shared.then(snapshot => copy(snapshot, config));
  };
}
