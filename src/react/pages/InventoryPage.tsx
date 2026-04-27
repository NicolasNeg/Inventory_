import { useEffect, useMemo, useState } from "react";
import { getDataMode, inventoryApi } from "../api/createInventoryApi";

interface ProductRow {
  idFila?: number;
  producto?: string;
  marca?: string;
  subModelo?: string;
  disponible?: number | string;
  tipo?: string;
  reStockStatus?: string;
  statusNota?: string;
  movimientos?: string | number;
}

export function InventoryPage() {
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [error, setError] = useState<string | null>(null);
  const dataMode = getDataMode();

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

  const categories = useMemo(() => {
    const unique = Array.from(new Set(rows.map((r) => String(r.tipo || "").trim()).filter(Boolean)));
    return ["ALL", ...unique];
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      const textOk = !q || [r.producto, r.marca, r.subModelo, r.tipo].some((v) => String(v || "").toLowerCase().includes(q));
      const typeOk = typeFilter === "ALL" || String(r.tipo || "") === typeFilter;
      return textOk && typeOk;
    });
  }, [rows, query, typeFilter]);

  if (loading) {
    return (
      <section className="page">
        <div className="inventory-state-card">
          <h1 className="page-title">Panel Principal</h1>
          <p className="page-muted">Cargando inventario...</p>
        </div>
      </section>
    );
  }
  if (error) {
    return (
      <section className="page">
        <div className="inventory-state-card inventory-state-card--error">
          <h1 className="page-title">Panel Principal</h1>
          <p className="page-error">Error controlado al cargar inventario: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="page-head">
        <h1 className="page-title">Panel Principal</h1>
        <span className="page-badge">Modo datos: {dataMode === "supabase" ? "Supabase" : "Mock"}</span>
      </div>
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
      <div className="chip-row">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`chip ${typeFilter === cat ? "chip--active" : ""}`}
            onClick={() => setTypeFilter(cat)}
          >
            {cat === "ALL" ? "Todos" : cat}
          </button>
        ))}
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
      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>No hay resultados para los filtros actuales.</p>
        </div>
      ) : null}
      <div className="table-wrap">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Producto</th>
              <th>Marca</th>
              <th>Submodelo</th>
              <th>Movimientos</th>
              <th>Disponible</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, idx) => (
              <tr key={`${row.idFila || idx}-${row.producto || ""}`}>
                <td>{row.tipo || "—"}</td>
                <td>{row.producto || "—"}</td>
                <td>{row.marca || "—"}</td>
                <td>{row.subModelo || "—"}</td>
                <td>{row.movimientos ?? "—"}</td>
                <td>{row.disponible ?? "—"}</td>
                <td>
                  {String(row.reStockStatus || "").includes("PEDIR STOCK") ? (
                    <span className="table-badge table-badge--warn">Stock crítico</span>
                  ) : (
                    <span className="table-badge table-badge--ok">Estable</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
