import {
  FiHome,
  FiGrid,
  FiList,
  FiRefreshCw,
  FiBell,
  FiCreditCard,
  FiHelpCircle,
  FiActivity,
  FiCode,
  FiSettings,
  FiUsers,
} from "react-icons/fi";

/** Primary navigation (visibility flags keep the original white-label rules). */
export const getNavItems = () => [
  { name: "Dashboard", short: "Home", url: "/dashboard", icon: FiHome, show: true, primary: true },
  { name: "Products", short: "Products", url: "/products", icon: FiGrid, show: true, primary: true },
  { name: "Transactions", short: "History", url: "/transactions", icon: FiList, show: true, primary: true },
  { name: "Wallet", short: "Wallet", url: "/wallets", icon: FiCreditCard, show: true, primary: true },
  {
    name: "Converter",
    short: "Converter",
    url: "/converter",
    icon: FiRefreshCw,
    show: !["TEETOP DIGITAL"].includes(process.env.REACT_APP_NAME),
  },
  { name: "Notifications", short: "Alerts", url: "/notifications", icon: FiBell, show: true },
  { name: "Activity", short: "Activity", url: "/activities", icon: FiActivity, show: true },
  { name: "FAQs", short: "FAQs", url: "/faqs", icon: FiHelpCircle, show: true },
  { name: "API Documentation", short: "API Docs", url: "/documentation", icon: FiCode, show: true },
];

export const SECONDARY_NAV = [
  { name: "Refer a friend", url: "/wallets/referral", icon: FiUsers },
  { name: "Settings", url: "/settings", icon: FiSettings },
];

export const isActivePath = (pathname, url) =>
  url === "/" ? pathname === "/" : pathname === url || pathname.startsWith(`${url}/`);
