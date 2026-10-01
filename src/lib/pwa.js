/**
 * Tiny install-prompt store.
 * `beforeinstallprompt` can fire before any component mounts, so the listener
 * lives at module scope and components read it through useSyncExternalStore.
 */
const SERVER_STATE = { deferredPrompt: null, installed: false };
let state = SERVER_STATE;
const listeners = new Set();

const emit = patch => {
  state = { ...state, ...patch };
  listeners.forEach(l => l());
};

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault(); // we show our own UI instead of the mini-infobar
    emit({ deferredPrompt: e });
  });
  window.addEventListener("appinstalled", () => emit({ deferredPrompt: null, installed: true }));
}

export const subscribe = listener => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
export const getSnapshot = () => state;
export const getServerSnapshot = () => SERVER_STATE;

/** Shows the native install dialog (Chromium: Android + desktop). */
export async function promptInstall() {
  const event = state.deferredPrompt;
  if (!event) return "unavailable";
  event.prompt();
  const { outcome } = await event.userChoice;
  emit({ deferredPrompt: null }); // a prompt event can only be used once
  return outcome; // "accepted" | "dismissed"
}

export function detectEnvironment() {
  const ua = navigator.userAgent || "";
  const isIPadOS = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  const ios = /iPad|iPhone|iPod/.test(ua) || isIPadOS;
  const android = /Android/i.test(ua);
  return {
    platform: ios ? "ios" : android ? "android" : "desktop",
    standalone: isStandalone(),
  };
}

export function isStandalone() {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    window.matchMedia?.("(display-mode: window-controls-overlay)").matches ||
    window.navigator.standalone === true
  );
}

/** Banner snooze: hidden for a week after the user closes it. */
const DISMISS_KEY = "pwa-banner-dismissed-at";
const SNOOZE_MS = 7 * 24 * 60 * 60 * 1000;

export function readDismissed() {
  try {
    const at = Number(localStorage.getItem(DISMISS_KEY));
    return !!at && Date.now() - at < SNOOZE_MS;
  } catch {
    return false;
  }
}

export function writeDismissed() {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {}
}
