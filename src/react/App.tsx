import { InventoryPage } from "./features/inventory/InventoryPage";

export function App() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: "1rem", maxWidth: 960, margin: "0 auto" }}>
      <header style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.25rem", margin: 0 }}>Inventario — piloto React</h1>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0.5rem 0 0" }}>
          Consume{" "}
          <code style={{ fontSize: "0.8rem" }}>inventoryApi.obtenerProductos()</code> (mock / Apps Script / HTTP según entorno).
        </p>
      </header>
      <InventoryPage />
    </div>
  );
}
