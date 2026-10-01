/** Only same-site, in-app paths may be used as a post-login destination. */
export function safeNext(raw) {
  if (typeof raw !== "string") return null;
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) return null;
  if (/^\/(login|register)(\/|\?|$)/.test(raw)) return null;
  return raw;
}

/** Builds /login?next=<current page>, dropping the PWA launch marker. */
export function loginUrlFor(pathname, search = "") {
  const params = new URLSearchParams(search);
  params.delete("source");
  const qs = params.toString();
  const next = safeNext(`${pathname}${qs ? `?${qs}` : ""}`);
  return next && next !== "/" ? `/login?next=${encodeURIComponent(next)}` : "/login";
}
