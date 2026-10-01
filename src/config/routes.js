import dynamic from "next/dynamic";
import PageLoader from "@/components/ui/PageLoader";

const load = importer => dynamic(importer, { ssr: false, loading: () => <PageLoader /> });

/**
 * Durable Telecom configuaration route renderer
 * Route registry. Keys match the old `PageRender` page names
 * (`page`, `page/id`, `page/id/[id]` ...), so every old URL resolves exactly
 * as before. Each page is code-split.
 */
export const appRoutes = {
  dashboard: load(() => import("@/views/app/dashboard")),
  transactions: load(() => import("@/views/app/transactions")),
  settings: load(() => import("@/views/app/settings")),
  notifications: load(() => import("@/views/app/notifications")),
  converter: load(() => import("@/views/app/converter")),
  faqs: load(() => import("@/views/app/faqs")),
  activities: load(() => import("@/views/app/activities")),
  documentation: load(() => import("@/views/app/documentation")),
  wallets: load(() => import("@/views/app/wallets")),
  "wallets/bonus": load(() => import("@/views/app/wallets/bonus")),
  "wallets/commissions": load(() => import("@/views/app/wallets/commissions")),
  "wallets/referral": load(() => import("@/views/app/wallets/referral")),
  products: load(() => import("@/views/app/products")),
  "products/airtime": load(() => import("@/views/app/products/airtime")),
  "products/data": load(() => import("@/views/app/products/data")),
  "products/tv-subscriptions": load(() => import("@/views/app/products/tv-subscriptions")),
  "products/airtime_pin": load(() => import("@/views/app/products/airtime_pin")),
  "products/education": load(() => import("@/views/app/products/education")),
  "products/electricity-bills": load(() => import("@/views/app/products/electricity-bills")),
  "products/bulk_sms": load(() => import("@/views/app/products/bulk_sms")),
  "products/auto-buy": load(() => import("@/views/app/products/auto-buy")),
  "products/biz": load(() => import("@/views/app/products/biz")),
  "products/biz/verify": load(() => import("@/views/app/products/biz/verify")),
  "products/cgwallet": load(() => import("@/views/app/products/cgwallet")),
  "products/cgwallet/[id]": load(() => import("@/views/app/products/cgwallet/[id]")),
};

export const publicRoutes = {
  login: load(() => import("@/views/public/login")),
  register: load(() => import("@/views/public/register")),
  activate: load(() => import("@/views/public/activate")),
  "reset-activities": load(() => import("@/views/public/reset-activities")),
  "forget-password": load(() => import("@/views/public/forget-password")),
  privacy: load(() => import("@/views/public/privacy")),
  terms: load(() => import("@/views/public/terms")),
};

/** Sub-paths under /products and /wallets that have their own page. */
export const PRODUCT_PAGES = [
  "airtime", "data", "tv-subscriptions", "airtime_pin", "education",
  "biz", "auto-buy", "electricity-bills", "cgwallet", "bulk_sms",
];
export const WALLET_PAGES = ["bonus", "commissions", "referral"];

/** Pages guests may visit / that logged-in users get bounced away from. */
export const GUEST_PAGES = ["login", "register", "privacy", "terms", "reset-activities"];
export const AUTH_ONLY_REDIRECT = ["login", "register", "privacy", "terms"];

export function resolvePageName({ page, id, step }) {
  if (step) {
    if (id === "biz" && step === "verify") return `${page}/${id}/${step}`;
    return `${page}/${id}/[id]`;
  }
  if (id) {
    if (page === "products" && PRODUCT_PAGES.includes(id)) return `${page}/${id}`;
    if (page === "wallets" && WALLET_PAGES.includes(id)) return `${page}/${id}`;
    return `${page}/[id]`;
  }
  return `${page}`;
}
