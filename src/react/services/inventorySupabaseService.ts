import { productsFixture } from "../../dev/fixtures/products.fixture";
import { supabase } from "../lib/supabaseClient";

export const inventorySupabaseService = {
  async obtenerCategorias(): Promise<string[]> {
    if (!supabase) return ["FILTROS", "FRENOS", "ACEITES"];
    const { data, error } = await supabase.from("products").select("type");
    if (error) throw error;
    return Array.from(new Set((data || []).map((d) => d.type).filter(Boolean))) as string[];
  },

  async obtenerProductos(): Promise<unknown[]> {
    if (!supabase) return productsFixture;
    const { data, error } = await supabase.from("products").select("*").order("name");
    if (error) throw error;
    return (data || []).map((row) => ({
      idFila: row.id,
      producto: row.name,
      marca: row.brand || "",
      subModelo: row.sub_model || "",
      tipo: row.type || "",
      autos: (row.compatible_units || []).join(","),
      periodo: [row.period_month, row.period_year].filter(Boolean).join(" "),
      disponible: 0
    }));
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
