import { productsFixture } from "../../dev/fixtures/products.fixture";
import { supabase } from "../lib/supabaseClient";

interface LegacyInventoryRow {
  idFila: string | number;
  idOrden: string;
  tipo: string;
  producto: string;
  marca: string;
  subModelo: string;
  autos: string;
  stockInicial: number;
  salidas: number;
  disponible: number;
  reStockStatus: string;
  movimientos: string;
  periodo: string;
  statusNota: string;
  idNotaRelacionada: string;
}

interface StockAggregate {
  initial_stock: number;
  exits: number;
  available: number;
}

export const inventorySupabaseService = {
  async obtenerCategorias(): Promise<string[]> {
    if (!supabase) return ["FILTROS", "FRENOS", "ACEITES"];
    const { data, error } = await supabase.from("products").select("type");
    if (error) throw error;
    return Array.from(new Set((data || []).map((d) => d.type).filter(Boolean))) as string[];
  },

  async obtenerProductos(): Promise<LegacyInventoryRow[]> {
    if (!supabase) return productsFixture as LegacyInventoryRow[];

    const [productsRes, stockRes, movementsRes, notesRes] = await Promise.all([
      supabase.from("products").select("*").order("name"),
      supabase.from("inventory_stock").select("product_id,initial_stock,exits,available"),
      supabase.from("inventory_movements").select("product_id,id"),
      supabase.from("notes").select("id,product_id,status,created_at").order("created_at", { ascending: false })
    ]);

    if (productsRes.error) {
      console.error("[Supabase] Error leyendo products:", productsRes.error.message);
      throw new Error(`Supabase products read failed: ${productsRes.error.message}`);
    }
    if (stockRes.error) {
      console.error("[Supabase] Error leyendo inventory_stock:", stockRes.error.message);
      throw new Error(`Supabase inventory_stock read failed: ${stockRes.error.message}`);
    }
    if (movementsRes.error) {
      console.error("[Supabase] Error leyendo inventory_movements:", movementsRes.error.message);
      throw new Error(`Supabase inventory_movements read failed: ${movementsRes.error.message}`);
    }
    if (notesRes.error) {
      console.error("[Supabase] Error leyendo notes:", notesRes.error.message);
      throw new Error(`Supabase notes read failed: ${notesRes.error.message}`);
    }

    const stockByProduct = new Map<string, StockAggregate>();
    for (const s of stockRes.data || []) {
      const current = stockByProduct.get(String(s.product_id)) || { initial_stock: 0, exits: 0, available: 0 };
      current.initial_stock += Number(s.initial_stock || 0);
      current.exits += Number(s.exits || 0);
      current.available += Number(s.available || 0);
      stockByProduct.set(String(s.product_id), current);
    }

    const movementCount = new Map<string, number>();
    for (const m of movementsRes.data || []) {
      const key = String(m.product_id);
      movementCount.set(key, (movementCount.get(key) || 0) + 1);
    }

    const pendingNoteByProduct = new Map<string, { id: string; status: string }>();
    for (const n of notesRes.data || []) {
      if (String(n.status || "").toUpperCase() !== "PENDIENTE") continue;
      const key = String(n.product_id || "");
      if (!key || pendingNoteByProduct.has(key)) continue;
      pendingNoteByProduct.set(key, { id: String(n.id), status: "PENDIENTE" });
    }

    return (productsRes.data || []).map((row) => {
      const productId = String(row.id);
      const stock = stockByProduct.get(productId) || { initial_stock: 0, exits: 0, available: 0 };
      const note = pendingNoteByProduct.get(productId);
      const critical = Number(row.critical_stock || 0);
      const shouldRestock = critical > 0 && stock.available <= critical;
      return {
        idFila: productId,
        idOrden: String(row.sku || row.id),
        tipo: row.type || "",
        producto: row.name || "Producto",
        marca: row.brand || "",
        subModelo: row.sub_model || "",
        autos: Array.isArray(row.compatible_units) ? row.compatible_units.join(", ") : "",
        stockInicial: stock.initial_stock,
        salidas: stock.exits,
        disponible: stock.available,
        reStockStatus: shouldRestock ? "PEDIR STOCK" : "",
        movimientos: `${movementCount.get(productId) || 0} MOVIMIENTOS`,
        periodo: [row.period_month, row.period_year].filter(Boolean).join(" "),
        statusNota: note ? note.status : "",
        idNotaRelacionada: note ? note.id : ""
      };
    });
  },

  async obtenerListaProductosSimplificada(): Promise<Array<{ idOrden: string; nombre: string }>> {
    const rows = await this.obtenerProductos();
    return rows.map((p) => ({
      idOrden: String((p as { idFila?: string }).idFila || ""),
      nombre: `${(p as { producto?: string }).producto || "Producto"} | ${(p as { subModelo?: string }).subModelo || ""}`
    }));
  },

  async guardarProducto(_payload: unknown): Promise<unknown> {
    if (!supabase) return { success: true, mode: "mock" };
    return { success: false, message: "Escrituras deshabilitadas hasta validar schema y RLS." };
  }
};
