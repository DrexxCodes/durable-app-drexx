"use client";

/**
 * Drop-in replacement for the small slice of react-router-dom the legacy
 * feature modules use (Link, useNavigate, useParams, useLocation,
 * useSearchParams). Keeps every page's logic untouched while routing is
 * handled by Next.js.
 *
 * Old routes were `/:page/:id/:step`, so params are derived from the path.
 */
import NextLink from "next/link";
import { useCallback, useMemo } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams as useNextSearchParams,
} from "next/navigation";

export function Link({ to, href, children, replace, ...rest }) {
  const target = href ?? to ?? "#";
  return (
    <NextLink href={target} replace={replace} {...rest}>
      {children}
    </NextLink>
  );
}

export function useNavigate() {
  const router = useRouter();
  return useCallback(
    (to, options = {}) => {
      if (typeof to === "number") {
        if (to < 0) router.back();
        else if (to > 0) window.history.go(to);
        return;
      }
      if (!to) return;
      if (options.replace) router.replace(to);
      else router.push(to);
    },
    [router]
  );
}

export function useParams() {
  const pathname = usePathname() || "/";
  return useMemo(() => {
    const [page, id, step] = pathname.split("/").filter(Boolean);
    return { page, id, step };
  }, [pathname]);
}

export function useLocation() {
  const pathname = usePathname() || "/";
  const search = useNextSearchParams();
  return useMemo(
    () => ({
      pathname,
      search: search?.toString() ? `?${search.toString()}` : "",
    }),
    [pathname, search]
  );
}

export function useSearchParams() {
  const params = useNextSearchParams();
  return [params];
}
