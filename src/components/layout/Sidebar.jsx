import { Link } from "@/lib/router";
import { FiChevronsLeft, FiChevronsRight, FiLogOut } from "react-icons/fi";
import Logo from "@/components/ui/Logo";
import { SECONDARY_NAV, isActivePath } from "@/constants/navigation";

export default function Sidebar({ items, pathname, collapsed, onToggle, onLogout }) {
  return (
    <aside className={`app-sidebar ${collapsed ? "is-collapsed" : ""}`}>
      <div className="app-sidebar-head">
        <Logo size={34} />
        <button className="ui-icon-btn" onClick={onToggle} aria-label="Toggle sidebar">
          {collapsed ? <FiChevronsRight /> : <FiChevronsLeft />}
        </button>
      </div>

      <nav className="app-sidebar-nav" aria-label="Main">
        {items.map(({ name, url, icon: Icon }) => (
          <Link
            key={url}
            to={url}
            title={name}
            className={`nav-item ${isActivePath(pathname, url) ? "is-active" : ""}`}>
            <Icon size={20} />
            <span>{name}</span>
          </Link>
        ))}
      </nav>

      <div className="app-sidebar-foot">
        {SECONDARY_NAV.map(({ name, url, icon: Icon }) => (
          <Link
            key={url}
            to={url}
            title={name}
            className={`nav-item ${isActivePath(pathname, url) ? "is-active" : ""}`}>
            <Icon size={20} />
            <span>{name}</span>
          </Link>
        ))}
        <button type="button" className="nav-item nav-danger" title="Logout" onClick={onLogout}>
          <FiLogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
