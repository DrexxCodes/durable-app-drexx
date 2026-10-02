"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// The snow library is only downloaded when snow is actually switched on.
const Snowfall = dynamic(() => import("react-snowfall"), { ssr: false });

// Soft icy blue so the flakes stay visible on both the white pages and the dark purple sections.
const FLAKE_COLOR = "#8fc7f2";

/**
 * Snow across the whole app.
 * Controlled by the `isSnow` env var: "1" = snowing, "0" or not set = off.
 * Also stays off for people who ask their device for reduced motion.
 */
export default function Snow() {
  const [mode, setMode] = useState(null); // null = off, otherwise "small" | "large"

  useEffect(() => {
    if (process.env.isSnow !== "1") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    setMode(window.matchMedia?.("(max-width: 768px)").matches ? "small" : "large");
  }, []);

  if (!mode) return null;

  return (
    <Snowfall
      color={FLAKE_COLOR}
      snowflakeCount={mode === "small" ? 70 : 140}
      radius={[0.5, 3]}
      speed={[0.5, 2.5]}
      wind={[-0.5, 1.5]}
      style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 3400, pointerEvents: "none" }}
    />
  );
}
