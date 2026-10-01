import { useState } from "react";
import { FaWhatsapp, FaFacebookF } from "react-icons/fa";
import { BsInstagram, BsTwitter } from "react-icons/bs";
import { FiMail, FiMessageCircle, FiX } from "react-icons/fi";

const channels = () => [
  { key: "tw", href: process.env.REACT_APP_AGENT_TWITTER, title: "Twitter", icon: <BsTwitter /> },
  { key: "ig", href: process.env.REACT_APP_AGENT_INSTAGRAM, title: "Instagram", icon: <BsInstagram /> },
  { key: "fb", href: process.env.REACT_APP_AGENT_FACEBOOK, title: "Facebook", icon: <FaFacebookF /> },
  { key: "wg", href: process.env.REACT_APP_AGENT_WHATSAPP_GROUP, title: "Join WhatsApp group", icon: <FaWhatsapp /> },
  { key: "wa", href: process.env.REACT_APP_AGENT_WHATSAPP, title: "Chat on WhatsApp", icon: <FaWhatsapp /> },
  {
    key: "em",
    href: process.env.REACT_APP_AGENT_EMAIL ? `mailto:${process.env.REACT_APP_AGENT_EMAIL}` : "",
    title: "Email support",
    icon: <FiMail />,
  },
].filter(c => c.href);

/** One tidy help button instead of a column of floating icons. */
export default function SupportFab() {
  const [open, setOpen] = useState(false);
  const list = channels();
  if (!list.length) return null;

  return (
    <div className="support-fab">
      {open && (
        <div className="support-list">
          {list.map(c => (
            <a key={c.key} href={c.href} title={c.title} aria-label={c.title} target="_blank" rel="noreferrer">
              {c.icon}
            </a>
          ))}
        </div>
      )}
      <button
        type="button"
        className="support-toggle"
        onClick={() => setOpen(o => !o)}
        aria-label={open ? "Close support" : "Contact support"}>
        {open ? <FiX size={20} /> : <FiMessageCircle size={20} />}
      </button>
    </div>
  );
}
