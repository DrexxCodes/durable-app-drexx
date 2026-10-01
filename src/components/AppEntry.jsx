"use client";

import dynamic from "next/dynamic";
import PageLoader from "@/components/ui/PageLoader";

/**
 * The app depends on browser-only state (localStorage token, redux store),
 * exactly like the old CRA build, so the shell is rendered client-side only.
 */
const AppRoot = dynamic(() => import("@/components/AppRoot"), {
  ssr: false,
  loading: () => <PageLoader fullscreen />,
});

export default function AppEntry({ children }) {
  return <AppRoot>{children}</AppRoot>;
}
