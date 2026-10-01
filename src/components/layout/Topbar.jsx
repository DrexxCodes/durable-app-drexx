import { Link } from "@/lib/router";
import { FiArrowLeft, FiBell } from "react-icons/fi";
import Avatar from "@/components/ui/Avatar";
import Logo from "@/components/ui/Logo";
import InstallButton from "@/components/pwa/InstallButton";
import { useGreeting } from "@/hooks/useGreeting";

export default function Topbar({ pathname, title, user, onBack }) {
  const greeting = useGreeting();
  const isDashboard = pathname === "/dashboard";
  const pageTitle = title || pathname.split("/")[1] || "";

  return (
    <header className="app-topbar">
      <div className="d-flex align-items-center gap-2 min-w-0">
        <div className="d-lg-none me-1">
          <Logo size={28} />
        </div>
        {!isDashboard && (
          <button className="ui-icon-btn" onClick={onBack} aria-label="Go back">
            <FiArrowLeft size={20} />
          </button>
        )}
        <div className="min-w-0">
          {isDashboard ? (
            <>
              <small className="topbar-eyebrow">{user?.privilege}</small>
              <h1 className="topbar-title text-truncate">
                {greeting}, {user?.firstName} {user?.lastName}
              </h1>
            </>
          ) : (
            <h1 className="topbar-title text-capitalize text-truncate">{pageTitle}</h1>
          )}
        </div>
      </div>

      <div className="d-flex align-items-center gap-2">
        <InstallButton />
        <Link to="/notifications" className="ui-icon-btn d-none d-md-inline-flex" aria-label="Notifications">
          <FiBell size={20} />
        </Link>
        <Link to="/settings" aria-label="Settings" className="d-inline-flex">
          <Avatar user={user} size={40} />
        </Link>
      </div>
    </header>
  );
}
