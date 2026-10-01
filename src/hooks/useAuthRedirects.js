import { useEffect, useMemo } from "react";
import { useNavigate } from "@/lib/router";
import { isStandalone } from "@/lib/pwa";
import { loginUrlFor, safeNext } from "@/lib/redirect";
import { appRoutes, AUTH_ONLY_REDIRECT } from "@/config/routes";

/** First URL segment of every logged-in page (dashboard, products, wallets ...). */
const APP_AREAS = new Set(Object.keys(appRoutes).map(key => key.split("/")[0]));

/**
 * Auth-aware redirects, including the installed-app launch rules:
 *  - launching the PWA (start_url /dashboard, or "/" on iOS / older installs):
 *      logged in      -> dashboard (session resumes from the stored token)
 *      not logged in  -> /login
 *  - guests opening any logged-in page (shortcuts, bookmarks) -> /login?next=<page>
 *  - logged-in users opening login/register -> back to `next`, else the dashboard
 * Nothing redirects until the stored token has been checked, so a returning user
 * is never bounced to login while their session is still loading.
 */
export function useAuthRedirects({ auth, page, isRoot, pathname, search }) {
  const navigate = useNavigate();

  const sessionReady = !auth?.token || !!auth?.checked || !!auth?.user;
  const isAppArea = !isRoot && APP_AREAS.has(page);
  const standalone = useMemo(() => (typeof window !== "undefined" ? isStandalone() : false), []);

  useEffect(() => {
    if (!sessionReady) return;

    if (auth?.user) {
      if (AUTH_ONLY_REDIRECT.includes(page)) {
        const next = safeNext(new URLSearchParams(search).get("next"));
        navigate(next || "/dashboard", { replace: true });
      }
      return; // "/" is forwarded to /dashboard by AppHome
    }

    if (isAppArea) navigate(loginUrlFor(pathname, search), { replace: true });
    else if (isRoot && standalone) navigate("/login", { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionReady, auth?.user, page, isRoot, isAppArea, standalone, pathname, search]);

  return {
    sessionReady,
    isAppArea,
    // true while a redirect is about to happen, so no wrong screen flashes
    redirecting: !auth?.user && (isAppArea || (isRoot && standalone)),
  };
}
