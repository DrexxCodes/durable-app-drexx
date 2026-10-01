import { FiSmartphone, FiWifi, FiTv, FiZap, FiBookOpen, FiRepeat, FiClock, FiTag, FiHeadphones } from "react-icons/fi";

export const SERVICES = [
  { icon: FiWifi, title: "Data bundles", text: "Affordable data plans for every Nigerian network." },
  { icon: FiSmartphone, title: "Airtime top-up", text: "Instant recharge at competitive rates." },
  { icon: FiTv, title: "Cable TV", text: "Renew DSTV, GOtv and Startimes in seconds." },
  { icon: FiZap, title: "Electricity bills", text: "Pay prepaid and postpaid meters without the queue." },
  { icon: FiBookOpen, title: "Exam pins", text: "WAEC, NECO and NABTEB scratch cards on demand." },
  { icon: FiRepeat, title: "Airtime to cash", text: "Convert unused airtime into money." },
];

export const REASONS = [
  { icon: FiClock, title: "Instant delivery", text: "Most orders are completed within seconds." },
  { icon: FiTag, title: "Fair pricing", text: "Low charges with discounts for resellers." },
  { icon: FiHeadphones, title: "Real support", text: "Reach us on WhatsApp, email or phone." },
];

/** Copy for the scroll-inversion hero and the call-to-action section below it. */
export const HERO_COPY = {
  before: "Pay Less",
  highlight: "Get More",
  text: "Buy data, airtime, cable and electricity in a few clicks.",
  hint: "Scroll",
};

export const CTA_COPY = {
  eyebrow: "Ready when you are",
  title: ["Pay bills. Buy data.", "Done in seconds."],
  text: "Top up airtime, renew your cable, buy electricity tokens and exam pins from one wallet. No queues, no stress.",
};
