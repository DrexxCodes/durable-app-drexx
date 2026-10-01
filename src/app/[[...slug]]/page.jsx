import RouteView from "@/components/RouteView";

// One optional catch-all keeps every original URL (/dashboard, /products/airtime,
// /wallets/referral, /products/cgwallet/:id ...) working exactly as before.
export default function Page() {
  return <RouteView />;
}
