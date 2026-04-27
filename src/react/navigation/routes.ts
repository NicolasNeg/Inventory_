export interface AppRouteDef {
  path: string;
  label: string;
  group: "Principal" | "Operacion" | "Administracion";
}

export const ROUTE_DEFS = {
  inventory: { path: "/inventario", label: "Panel Principal", group: "Principal" },
  notes: { path: "/notas", label: "Centro de Alertas", group: "Principal" },
  newItem: { path: "/nuevo", label: "Nuevo Registro", group: "Operacion" },
  historyLoads: { path: "/historial-cargas", label: "Historial Cargas", group: "Operacion" },
  movementLog: { path: "/log-general", label: "Log General", group: "Operacion" },
  warehouseMap: { path: "/mapa-almacen", label: "Mapa del Almacén", group: "Operacion" },
  authorizations: { path: "/autorizaciones", label: "Autorizaciones", group: "Administracion" },
  userManagement: { path: "/gestion-usuarios", label: "Gestión de Usuarios", group: "Administracion" },
  retiro: { path: "/retiro", label: "Retiro", group: "Operacion" },
  reingreso: { path: "/reingreso", label: "Reingreso", group: "Operacion" },
  agregarStock: { path: "/agregar-stock", label: "Agregar Stock", group: "Operacion" },
  historialProducto: { path: "/historial-producto", label: "Historial Producto", group: "Operacion" }
} as const satisfies Record<string, AppRouteDef>;

export const SIDEBAR_MAIN_ROUTES = [
  ROUTE_DEFS.inventory,
  ROUTE_DEFS.notes,
  ROUTE_DEFS.newItem,
  ROUTE_DEFS.historyLoads,
  ROUTE_DEFS.movementLog,
  ROUTE_DEFS.warehouseMap,
  ROUTE_DEFS.authorizations,
  ROUTE_DEFS.userManagement
];
