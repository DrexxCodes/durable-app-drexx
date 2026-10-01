import { useContext, useEffect, useMemo, useState } from "react";
import { GlobalState } from "@/Data/Context";
import { useLocation, useNavigate } from "@/lib/router";
import { getNavItems } from "@/constants/navigation";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useIdleLogout } from "@/hooks/useIdleLogout";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import BottomNav from "./BottomNav";
import LogoutDialog from "./LogoutDialog";
import SupportFab from "@/components/feedback/SupportFab";
import DevCredit from "@/components/ui/DevCredit";

/** Authenticated layout: sidebar (desktop) / bottom tabs (mobile) + top bar. */
export default function AppShell({ children }) {
  const { auth, stateName, getNotify, logoutUser } = useContext(GlobalState);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const items = useMemo(() => getNavItems().filter(i => i.show), []);

  useDocumentTitle(pathname);

  // pop-up notifications for the dashboard (was done by the old header)
  useEffect(() => {
    getNotify("incoming", { status: "play" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    setConfirmLogout(false);
    await logoutUser();
    navigate("/");
  };
  useIdleLogout(handleLogout);

  return (
    <div className={`app-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
      <Sidebar
        items={items}
        pathname={pathname}
        collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
        onLogout={() => setConfirmLogout(true)}
      />
      <div className="app-body">
        <Topbar pathname={pathname} title={stateName} user={auth?.user} onBack={() => navigate(-1)} />
        <main className="app-main">{children}</main>
        <footer className="app-footer">
          <DevCredit />
        </footer>
      </div>
      <BottomNav items={items} pathname={pathname} onLogout={() => setConfirmLogout(true)} />
      <SupportFab />
      <LogoutDialog
        isOpen={confirmLogout}
        onCancel={() => setConfirmLogout(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
