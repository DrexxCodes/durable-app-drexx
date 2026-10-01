"use client";

import dynamic from "next/dynamic";
import PageLoader from "@/components/ui/PageLoader";

/** Client-only (it needs the redux store / localStorage), rendered inside the layout's shell. */
const PageRouter = dynamic(() => import("@/components/PageRouter"), {
  ssr: false,
  loading: () => <PageLoader />,
});

export default function RouteView() {
  return <PageRouter />;
}
