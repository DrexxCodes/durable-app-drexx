"use client";

import { useEffect, useRef, useState } from "react";
import RefreshIndicator from "@/components/ui/RefreshIndicator";

const THRESHOLD = 70; // px of (resisted) pull needed to trigger a refresh
const MAX_PULL = 110;
const RESISTANCE = 0.5;
const RELOAD_DELAY = 350; // let the ring be seen sweeping before the page reloads

/** True when the touch started somewhere that should keep its own scrolling (modals, scrolled lists). */
const shouldIgnore = el => {
  if (!(el instanceof Element)) return false;
  if (el.closest(".ui-modal-backdrop, [data-no-ptr]")) return true;
  for (let n = el; n && n !== document.body && n !== document.documentElement; n = n.parentElement) {
    const { overflowY } = getComputedStyle(n);
    if (/(auto|scroll)/.test(overflowY) && n.scrollHeight > n.clientHeight && n.scrollTop > 0) return true;
  }
  return false;
};

/**
 * Pull down from the top of the page (browser or installed PWA) to refresh.
 * The app image appears at the top, the ring fills as you pull, then sweeps around the image
 * while the page reloads. The native overscroll refresh is switched off in CSS
 * (overscroll-behavior-y: contain) so there is only ever one indicator.
 */
export default function PullToRefresh() {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const refreshingRef = useRef(false);

  useEffect(() => {
    let startY = null;
    let active = false;
    let current = 0;

    const reset = () => {
      active = false;
      current = 0;
      setDragging(false);
      setPull(0);
    };

    const onStart = e => {
      if (refreshingRef.current || e.touches.length !== 1) return;
      if (window.scrollY > 0 || shouldIgnore(e.target)) {
        startY = null;
        return;
      }
      startY = e.touches[0].clientY;
    };

    const onMove = e => {
      if (startY == null || refreshingRef.current) return;
      const dy = e.touches[0].clientY - startY;
      if (window.scrollY > 0) {
        startY = null;
        if (active) reset();
        return;
      }
      if (dy <= 0) {
        if (active) reset();
        return;
      }
      if (!active) {
        active = true;
        setDragging(true);
      }
      if (e.cancelable) e.preventDefault(); // stop the browser's own overscroll / rubber band
      current = Math.min(MAX_PULL, dy * RESISTANCE);
      setPull(current);
    };

    const onEnd = () => {
      const wasActive = active;
      startY = null;
      if (!wasActive) return;
      active = false;
      setDragging(false);
      if (current >= THRESHOLD) {
        refreshingRef.current = true;
        setRefreshing(true);
        setPull(THRESHOLD);
        window.setTimeout(() => window.location.reload(), RELOAD_DELAY);
      } else {
        reset();
      }
    };

    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd, { passive: true });
    window.addEventListener("touchcancel", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("touchcancel", onEnd);
    };
  }, []);

  if (pull === 0 && !refreshing) return null;

  const progress = Math.min(1, pull / THRESHOLD);
  // hidden above the screen at pull = 0, resting at the top once the threshold is reached
  const y = Math.min(pull - THRESHOLD, 20);

  return (
    <div
      className={`ptr-host${dragging ? "" : " is-settling"}`}
      style={{ transform: `translateY(${y}px)`, opacity: refreshing ? 1 : Math.min(1, progress * 1.4) }}
      role="status"
      aria-label={refreshing ? "Refreshing" : "Pull to refresh"}>
      <RefreshIndicator progress={progress} spinning={refreshing} />
    </div>
  );
}
