import { useEffect } from "react";

const MAX_BALL = 380; // px: diameter while the circle travels up the screen
const clamp = v => Math.min(1, Math.max(0, v));
const easeInOutQuart = t => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2);

/**
 * Drives the "inversion circle" hero from the window scroll position.
 * The track is 300vh tall and the hero is sticky inside it, so scrolling the
 * track gives two phases of one viewport height each:
 *   1. the circle rises from below the screen to the centre (ease in-out)
 *   2. the circle grows until it covers the screen (ease-in)
 * A clip-path on the light text layer mirrors the circle, which creates the
 * colour inversion. Styles are written straight to the DOM from a rAF loop,
 * so scrolling never triggers a React re-render.
 */
export function useInversionScroll({ trackRef, heroRef, ballRef, lightRef }) {
  useEffect(() => {
    const track = trackRef.current;
    const hero = heroRef.current;
    const ball = ballRef.current;
    const light = lightRef.current;
    if (!track || !hero || !ball || !light) return;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let w = hero.clientWidth;
    let h = hero.clientHeight;
    let raf = 0;

    const render = () => {
      raf = 0;
      // reduced motion: show the finished state (full-screen brand colour)
      const scrolled = reduceMotion ? h * 2 : -track.getBoundingClientRect().top;
      const p1 = clamp(scrolled / h);
      const p2 = clamp((scrolled - h) / h);

      const base = Math.min(MAX_BALL, w * 0.9);
      const cover = Math.max(w, h) * 2.8;
      const size = base + p2 * p2 * (cover - base);
      const yOff = (1 - easeInOutQuart(p1)) * (h / 2 + base / 2);

      ball.style.width = ball.style.height = `${size}px`;
      ball.style.transform = `translate(-50%, calc(-50% + ${yOff}px))`;
      light.style.clipPath = `circle(${size / 2}px at ${w / 2}px ${h / 2 + yOff}px)`;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };

    const ro = new ResizeObserver(() => {
      w = hero.clientWidth;
      h = hero.clientHeight;
      schedule();
    });
    ro.observe(hero);
    if (!reduceMotion) window.addEventListener("scroll", schedule, { passive: true });
    render();

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [trackRef, heroRef, ballRef, lightRef]);
}
