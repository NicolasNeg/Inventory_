import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { ROUTE_DEFS } from "./navigation/routes";
import { AuthorizationsPage } from "./pages/AuthorizationsPage";
import { HistoryLoadsPage } from "./pages/HistoryLoadsPage";
import { InventoryPage } from "./pages/InventoryPage";
import { MovementLogPage } from "./pages/MovementLogPage";
import { NewItemPage } from "./pages/NewItemPage";
import { NotesPage } from "./pages/NotesPage";
import { UserManagementPage } from "./pages/UserManagementPage";
import { WarehouseMapPage } from "./pages/WarehouseMapPage";

export function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to={ROUTE_DEFS.inventory.path} replace />} />
        <Route path={ROUTE_DEFS.inventory.path} element={<InventoryPage />} />
        <Route path={ROUTE_DEFS.notes.path} element={<NotesPage />} />
        <Route path={ROUTE_DEFS.newItem.path} element={<NewItemPage />} />
        <Route path={ROUTE_DEFS.historyLoads.path} element={<HistoryLoadsPage />} />
        <Route path={ROUTE_DEFS.movementLog.path} element={<MovementLogPage />} />
        <Route path={ROUTE_DEFS.warehouseMap.path} element={<WarehouseMapPage />} />
        <Route path={ROUTE_DEFS.authorizations.path} element={<AuthorizationsPage />} />
        <Route path={ROUTE_DEFS.userManagement.path} element={<UserManagementPage />} />
        <Route path="*" element={<Navigate to={ROUTE_DEFS.inventory.path} replace />} />
      </Routes>
    </AppShell>
  );
}
