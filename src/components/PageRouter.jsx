import { useContext, useEffect } from "react";
import { GlobalState } from "@/Data/Context";
import { useLocation, useNavigate, useParams } from "@/lib/router";
import { publicRoutes, appRoutes, resolvePageName, GUEST_PAGES } from "@/config/routes";
import { useAuthRedirects } from "@/hooks/useAuthRedirects";
import PageLoader from "@/components/ui/PageLoader";
import ErrorPage from "@/features/ErrorPage";
import AppHome from "@/views/app/home";
import Landing from "@/components/landing/Landing";

/** Port of the old PageRender: same auth redirects, same URL -> page rules. */
export default function PageRouter() {
  const { auth, errors, clearErrors } = useContext(GlobalState);
  const params = useParams();
  const { pathname, search } = useLocation();
  const isRoot = pathname === "/";
  const navigate = useNavigate();
  const page = isRoot ? undefined : params.page;

  const { sessionReady, isAppArea, redirecting } = useAuthRedirects({
    auth,
    page,
    isRoot,
    pathname,
    search,
  });

  useEffect(() => {
    // logged-in pages handle their own guest redirect (-> /login?next=...)
    if (!auth?.isAuth && errors?.errorText) {
      if (!GUEST_PAGES.includes(page) && !isAppArea) navigate("/");
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, auth?.isAuth, navigate, errors?.errorText]);

  // A stored token is still being verified: don't flash landing / 404 / login.
  if (!sessionReady && !auth?.user) return <PageLoader fullscreen />;

  // Full-screen loader only on first boot. Once the shell is visible (user known),
  // a background refresh must not cover the persistent nav.
  if (auth?.token && auth?.loading) return <PageLoader fullscreen={!auth?.user} />;

  if (redirecting) return <PageLoader fullscreen />;

  if (isRoot) return auth?.user ? <AppHome /> : <Landing />;

  const registry = auth?.user ? appRoutes : publicRoutes;
  const Page = registry[resolvePageName(params)];
  return Page ? <Page /> : <ErrorPage />;
}
