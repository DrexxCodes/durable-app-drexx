import { useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { TOKEN } from "@/Data/Actions/ActionTypes";
import { catalogsForPath } from "@/constants/catalog";

// The HTTP layer (lib/http.js) already serves catalog GETs from a 30s window and the backend caches them
// for 60s, so refreshing more often than this would only burn requests (and the API rate limit).
const MIN_GAP_MS = 45 * 1000;

/**
 * Keeps the catalog data the current page depends on fresh while the app stays open:
 *  - when the user opens / navigates to a product page
 *  - when the tab or installed PWA comes back to the foreground, or the network returns
 * A failed refresh never clears what is already on screen (the reducers keep their state on FAIL).
 */
export function useCatalogRefresh(pathname) {
  const dispatch = useDispatch();
  const lastRun = useRef(new Map()); // loader -> timestamp, so one loader is never fired twice inside the gap
  const pathRef = useRef(pathname);
  pathRef.current = pathname;

  const refresh = useCallback(() => {
    if (typeof window === "undefined" || !localStorage.getItem(TOKEN)) return;
    const now = Date.now();
    catalogsForPath(pathRef.current).forEach(load => {
      if (now - (lastRun.current.get(load) || 0) < MIN_GAP_MS) return;
      lastRun.current.set(load, now);
      dispatch(load());
    });
  }, [dispatch]);

  useEffect(() => {
    refresh();
  }, [pathname, refresh]);

  useEffect(() => {
    const onVisible = () => document.visibilityState === "visible" && refresh();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("online", refresh);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("online", refresh);
    };
  }, [refresh]);
}
