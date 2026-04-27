import { useEffect, useState } from "react";
import { inventoryApi } from "../../inventoryApiClient";

/** Fila legacy devuelta por `obtenerProductos()` (contrato actual sin cambiar). */
interface LegacyProductRow {
  idFila?: number;
  producto?: string;
  marca?: string;
  subModelo?: string;
  disponible?: number | string;
  tipo?: string;
}

export function InventoryPage() {
  const [rows, setRows] = useState<LegacyProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    inventoryApi
      .obtenerProductos()
      .then((data) => {
        if (!cancelled) setRows(Array.isArray(data) ? (data as LegacyProductRow[]) : []);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p style={{ color: "#64748b" }}>Cargando inventario…</p>;
  }

  if (error) {
    return (
      <div style={{ color: "#b91c1c", padding: "1rem", background: "#fef2f2", borderRadius: 8 }}>
        <strong>Error:</strong> {error}
      </div>
    );
  }

  if (rows.length === 0) {
    return <p style={{ color: "#64748b" }}>No hay productos.</p>;
  }

  return (
    <div>
      <p style={{ fontSize: "0.875rem", color: "#64748b", marginBottom: "1rem" }}>
        {rows.length} producto(s)
      </p>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>
            <th style={{ padding: "0.5rem" }}>Producto</th>
            <th style={{ padding: "0.5rem" }}>Marca</th>
            <th style={{ padding: "0.5rem" }}>Sub-modelo</th>
            <th style={{ padding: "0.5rem" }}>Tipo</th>
            <th style={{ padding: "0.5rem" }}>Disponible</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p, i) => (
            <tr key={`${p.idFila ?? i}-${p.producto ?? ""}`} style={{ borderBottom: "1px solid #f1f5f9" }}>
              <td style={{ padding: "0.5rem" }}>{p.producto ?? "—"}</td>
              <td style={{ padding: "0.5rem" }}>{p.marca ?? "—"}</td>
              <td style={{ padding: "0.5rem" }}>{p.subModelo ?? "—"}</td>
              <td style={{ padding: "0.5rem" }}>{p.tipo ?? "—"}</td>
              <td style={{ padding: "0.5rem" }}>{p.disponible ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
