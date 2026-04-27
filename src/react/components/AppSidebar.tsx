import { NavLink } from "react-router-dom";
import { SIDEBAR_MAIN_ROUTES } from "../navigation/routes";

interface AppSidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onCloseMobile: () => void;
  userName: string;
  onLogout: () => void;
}

const groups = {
  Principal: SIDEBAR_MAIN_ROUTES.filter((r) => r.group === "Principal"),
  Operacion: SIDEBAR_MAIN_ROUTES.filter((r) => r.group === "Operacion"),
  Administracion: SIDEBAR_MAIN_ROUTES.filter((r) => r.group === "Administracion")
} as const;

export function AppSidebar({ collapsed, mobileOpen, onToggle, onCloseMobile, userName, onLogout }: AppSidebarProps) {
  return (
    <>
      <div
        className={`app-sidebar__backdrop ${mobileOpen ? "app-sidebar__backdrop--visible" : ""}`}
        onClick={onCloseMobile}
      />
      <aside
        className={`app-sidebar ${collapsed ? "app-sidebar--collapsed" : ""} ${mobileOpen ? "app-sidebar--mobile-open" : ""}`}
      >
      <div className="app-sidebar__brand">
        <div className="app-sidebar__logo">MEX Insumos</div>
        <button type="button" className="app-sidebar__collapse-btn" onClick={onToggle} aria-label="Toggle sidebar">
          ☰
        </button>
      </div>

      <nav id="app-sidebar-nav" className="app-sidebar__nav" aria-label="Main Navigation">
        {(Object.keys(groups) as Array<keyof typeof groups>).map((group) => (
          <section className="app-sidebar__group" key={group}>
            <h2 className="app-sidebar__group-title">{group}</h2>
            <div className="app-sidebar__group-items">
              {groups[group].map((route) => (
                <NavLink
                  key={route.path}
                  to={route.path}
                  className={({ isActive }) => `app-sidebar__item ${isActive ? "app-sidebar__item--active" : ""}`}
                  onClick={onCloseMobile}
                >
                  {route.label}
                </NavLink>
              ))}
            </div>
          </section>
        ))}
      </nav>

      <footer className="app-sidebar__footer">
        <p className="app-sidebar__user-label">Usuario activo</p>
        <p className="app-sidebar__user-name">{userName}</p>
        <button type="button" className="app-sidebar__logout-btn" onClick={onLogout}>
          Cerrar sesión
        </button>
      </footer>
      </aside>
    </>
  );
}
