import { useState } from "react";
import { Link } from "@/lib/router";
import { FiMoreHorizontal, FiLogOut, FiX } from "react-icons/fi";
import { SECONDARY_NAV, isActivePath } from "@/constants/navigation";

/** Mobile: 4 primary tabs + a "More" sheet for everything else. */
export default function BottomNav({ items, pathname, onLogout }) {
  const [open, setOpen] = useState(false);
  const primary = items.filter(i => i.primary);
  const more = items.filter(i => !i.primary);
  const moreActive = more.some(i => isActivePath(pathname, i.url)) ||
    SECONDARY_NAV.some(i => isActivePath(pathname, i.url));

  return (
    <>
      {open && <div className="sheet-backdrop" onClick={() => setOpen(false)} />}
      <div className={`more-sheet ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <div className="d-flex align-items-center justify-content-between mb-2">
          <strong>More</strong>
          <button className="ui-icon-btn" onClick={() => setOpen(false)} aria-label="Close menu">
            <FiX />
          </button>
        </div>
        <div className="more-grid">
          {[...more, ...SECONDARY_NAV].map(({ name, url, icon: Icon }) => (
            <Link key={url} to={url} onClick={() => setOpen(false)} className="more-item">
              <span className="more-icon">
                <Icon size={20} />
              </span>
              <span>{name}</span>
            </Link>
          ))}
          <button
            type="button"
            className="more-item more-danger"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}>
            <span className="more-icon">
              <FiLogOut size={20} />
            </span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      <nav className="app-bottomnav" aria-label="Primary">
        {primary.map(({ short, name, url, icon: Icon }) => (
          <Link key={url} to={url} className={`tab ${isActivePath(pathname, url) ? "is-active" : ""}`}>
            <Icon size={22} />
            <span>{short || name}</span>
          </Link>
        ))}
        <button type="button" className={`tab ${moreActive ? "is-active" : ""}`} onClick={() => setOpen(o => !o)}>
          <FiMoreHorizontal size={22} />
          <span>More</span>
        </button>
      </nav>
    </>
  );
}
