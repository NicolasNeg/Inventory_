import type { PropsWithChildren } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { SIDEBAR_MAIN_ROUTES } from "../navigation/routes";

interface AppShellProps extends PropsWithChildren {
  userName: string;
  authModeLabel: string;
  dataModeLabel: string;
  onLogout: () => void;
}

export function AppShell({ children, userName, authModeLabel, dataModeLabel, onLogout }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const activeRoute = SIDEBAR_MAIN_ROUTES.find((route) => location.pathname === route.path);
  const title = activeRoute ? activeRoute.label : "MEX Insumos";

  return (
    <div className="app-shell">
      <AppSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggle={() => setCollapsed((v) => !v)}
        onCloseMobile={() => setMobileOpen(false)}
        userName={userName}
        onLogout={onLogout}
      />
      <div className="app-shell__main">
        <header className="app-shell__header">
          <div className="app-shell__header-left">
            <button
              type="button"
              className="app-shell__menu-btn"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Abrir navegación"
            >
              ☰
            </button>
            <h1 className="app-shell__title">{title}</h1>
          </div>
          <div className="app-shell__status">
            <span className="app-shell__status-dot" /> Sistema en línea
          </div>
          <div className="app-shell__meta">
            <span className="app-shell__badge">Datos: {dataModeLabel}</span>
            <span className="app-shell__badge">Auth: {authModeLabel}</span>
            <span className="app-shell__user">{userName}</span>
            <button type="button" className="app-shell__logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        </header>
        <main className="app-shell__content">{children}</main>
      </div>
    </div>
  );
}
