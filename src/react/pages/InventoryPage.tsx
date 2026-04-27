import { useEffect, useMemo, useState } from "react";
import { inventoryApi } from "../api/createInventoryApi";

interface ProductRow {
  idFila?: number;
  producto?: string;
  marca?: string;
  subModelo?: string;
  disponible?: number | string;
  tipo?: string;
  reStockStatus?: string;
  statusNota?: string;
}

export function InventoryPage() {
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    inventoryApi
      .obtenerProductos()
      .then((data) => {
        if (!cancelled) setRows(Array.isArray(data) ? (data as ProductRow[]) : []);
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

  const stats = useMemo(() => {
    const requiere = rows.filter((r) => String(r.reStockStatus || "").includes("PEDIR STOCK")).length;
    const critico = rows.filter((r) => Number(r.disponible || 0) <= 2).length;
    const notas = rows.filter((r) => r.statusNota === "PENDIENTE").length;
    return { requiere, critico, notas };
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.producto, r.marca, r.subModelo, r.tipo].some((v) => String(v || "").toLowerCase().includes(q))
    );
  }, [rows, query]);

  if (loading) return <p>Cargando inventario...</p>;
  if (error) return <p className="page-error">Error: {error}</p>;

  return (
    <section className="page">
      <h1 className="page-title">Panel Principal</h1>
      <div className="kpi-grid">
        <article className="kpi-card">
          <p>Requiere surtido</p>
          <strong>{stats.requiere}</strong>
        </article>
        <article className="kpi-card">
          <p>Stock crítico</p>
          <strong>{stats.critico}</strong>
        </article>
        <article className="kpi-card">
          <p>Notas activas</p>
          <strong>{stats.notas}</strong>
        </article>
      </div>
      <div className="inventory-toolbar">
        <input
          className="inventory-search"
          placeholder="Buscar producto, marca, submodelo..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="button" className="inventory-qr-btn">
          Foto QR
        </button>
      </div>
      <div className="table-wrap">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Producto</th>
              <th>Marca</th>
              <th>Submodelo</th>
              <th>Disponible</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, idx) => (
              <tr key={`${row.idFila || idx}-${row.producto || ""}`}>
                <td>{row.tipo || "—"}</td>
                <td>{row.producto || "—"}</td>
                <td>{row.marca || "—"}</td>
                <td>{row.subModelo || "—"}</td>
                <td>{row.disponible ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
