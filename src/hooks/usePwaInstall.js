import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import {
  detectEnvironment,
  getServerSnapshot,
  getSnapshot,
  isStandalone,
  promptInstall,
  readDismissed,
  subscribe,
  writeDismissed,
} from "@/lib/pwa";

const appName = () => process.env.REACT_APP_NAME || "App";

/**
 * Install state for the banner and the desktop top-bar button.
 *  - android/desktop (Chromium): native prompt via beforeinstallprompt
 *  - ios: Safari has no install API, so we open the share sheet (it contains
 *    "Add to Home Screen") and fall back to step-by-step instructions.
 */
export function usePwaInstall() {
  const { deferredPrompt, installed } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [env, setEnv] = useState({ ready: false, platform: "desktop", standalone: false });
  const [dismissed, setDismissed] = useState(true); // hidden until storage is read

  useEffect(() => {
    setEnv({ ready: true, ...detectEnvironment() });
    setDismissed(readDismissed());

    const mq = window.matchMedia?.("(display-mode: standalone)");
    const onChange = () => setEnv(prev => ({ ...prev, standalone: isStandalone() }));
    mq?.addEventListener?.("change", onChange);
    return () => mq?.removeEventListener?.("change", onChange);
  }, []);

  const dismiss = useCallback(() => {
    writeDismissed();
    setDismissed(true);
  }, []);

  /** Resolves to: accepted | dismissed | shared | cancelled | instructions | unavailable */
  const install = useCallback(async () => {
    if (deferredPrompt) return promptInstall();

    if (env.platform === "ios") {
      if (typeof navigator.share === "function") {
        try {
          await navigator.share({ title: appName(), url: window.location.origin });
          return "shared";
        } catch (err) {
          if (err?.name === "AbortError") return "cancelled";
        }
      }
      return "instructions";
    }
    return "unavailable";
  }, [deferredPrompt, env.platform]);

  const isMobile = env.platform === "ios" || env.platform === "android";
  const canInstall = env.ready && !env.standalone && !installed && (!!deferredPrompt || env.platform === "ios");

  return {
    ...env,
    installed,
    dismissed,
    dismiss,
    install,
    isMobile,
    canPrompt: !!deferredPrompt,
    canInstall,
    // banner: phones only (Android needs the prompt event, iOS is always manual)
    showBanner: canInstall && isMobile && !dismissed,
    // desktop gets a quiet icon in the top bar instead of a banner
    showDesktopButton: canInstall && !isMobile,
  };
}
