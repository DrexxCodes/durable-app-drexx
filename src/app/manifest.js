const name = process.env.REACT_APP_NAME || "App";

export default function manifest() {
  return {
    id: "/",
    name,
    // home-screen labels truncate around 12 characters
    short_name: name.length > 12 ? name.split(" ")[0] : name,
    description: `${name}: buy airtime, data, cable, electricity and exam pins.`,
    // launching the installed app lands on the dashboard; guests are sent to /login by the router
    start_url: "/dashboard?source=pwa",
    scope: "/",
    // relaunching while the app is already open just resumes that window
    launch_handler: { client_mode: ["focus-existing", "auto"] },
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#c20e9c",
    lang: "en",
    categories: ["finance", "utilities"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Buy airtime", url: "/products/airtime", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Buy data", url: "/products/data", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Fund wallet", url: "/wallets", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
