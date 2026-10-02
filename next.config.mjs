/**
 * The original CRA app reads REACT_APP_* variables everywhere.
 * Expose them to the browser bundle as-is so your existing .env keeps working
 * (you can also use NEXT_PUBLIC_* for new variables).
 * `isSnow` is the one exception to the prefix rule: 1 = snow across the app, 0 or missing = off.
 */
const publicEnv = Object.fromEntries(
  Object.entries(process.env).filter(([key]) => key.startsWith("REACT_APP_") || key === "isSnow")
);

/** next/image only loads remote pictures from hosts listed here (when optimisation is on). */
const hostPattern = value => {
  try {
    const { protocol, hostname, port } = new URL(value);
    return { protocol: protocol.replace(":", ""), hostname, ...(port ? { port } : {}) };
  } catch {
    return null;
  }
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: publicEnv,
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "**.ufs.sh" }, // landing page photos
      hostPattern(process.env.REACT_APP_IMAGE_URL), // app logo
      hostPattern(process.env.REACT_APP_IMAGE_URL_LIGHT),
    ].filter(Boolean),
  },
  async headers() {
    return [
      {
        // always revalidate the service worker so updates reach users quickly
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        ],
      },
    ];
  },
};
export default nextConfig;
