import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/legacy.css";
import "@/styles/theme.css";
import "@/styles/landing.css";
import AppEntry from "@/components/AppEntry";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

const name = process.env.REACT_APP_NAME || "App";

export const metadata = {
  title: `${name}: Buy Airtime and Data for all Network. Make payment for DSTV, GoTv`,
  description: `${name} is a website that provides you with easy access to data, cheap internet data plans and airtime recharge`,
  keywords: "data,airtime,cables,electricity, waec/neco pin",
  applicationName: name,
  // /manifest.webmanifest is linked automatically from src/app/manifest.js
  appleWebApp: { capable: true, title: name, statusBarStyle: "default" },
  formatDetection: { telephone: false },
  icons: {
    icon: process.env.REACT_APP_IMAGE_URL || "/icons/favicon-48.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#c20e9c",
};

/**
 * AppEntry is the persistent shell (providers, sidebar / bottom nav, top bar).
 * It lives in the root layout, so it is never unmounted between route changes –
 * only `children` (the page) swaps.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AppEntry>{children}</AppEntry>
      </body>
    </html>
  );
}
