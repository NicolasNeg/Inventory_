import { NavLink } from "react-router-dom";
import { SIDEBAR_MAIN_ROUTES } from "../navigation/routes";

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const groups = {
  Principal: SIDEBAR_MAIN_ROUTES.filter((r) => r.group === "Principal"),
  Operacion: SIDEBAR_MAIN_ROUTES.filter((r) => r.group === "Operacion"),
  Administracion: SIDEBAR_MAIN_ROUTES.filter((r) => r.group === "Administracion")
} as const;

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  return (
    <aside className={`app-sidebar ${collapsed ? "app-sidebar--collapsed" : ""}`}>
      <div className="app-sidebar__brand">
        <div className="app-sidebar__logo">MEX Insumos</div>
        <button type="button" className="app-sidebar__collapse-btn" onClick={onToggle} aria-label="Toggle sidebar">
          ☰
        </button>
      </div>

      <nav className="app-sidebar__nav" aria-label="Main Navigation">
        {(Object.keys(groups) as Array<keyof typeof groups>).map((group) => (
          <section className="app-sidebar__group" key={group}>
            <h2 className="app-sidebar__group-title">{group}</h2>
            <div className="app-sidebar__group-items">
              {groups[group].map((route) => (
                <NavLink
                  key={route.path}
                  to={route.path}
                  className={({ isActive }) => `app-sidebar__item ${isActive ? "app-sidebar__item--active" : ""}`}
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
        <p className="app-sidebar__user-name">ANGEL ARMENTA</p>
        <button type="button" className="app-sidebar__logout-btn">
          Cerrar sesión
        </button>
      </footer>
    </aside>
  );
}
