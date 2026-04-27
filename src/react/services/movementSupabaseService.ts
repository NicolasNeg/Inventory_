import { historyFixture } from "../../dev/fixtures/history.fixture";
import { movementDetailBySubModelFixture, movementsFixture } from "../../dev/fixtures/movements.fixture";
import { supabase } from "../lib/supabaseClient";

export const movementSupabaseService = {
  async registrarRetiro(_payload: unknown): Promise<unknown> {
    if (!supabase) return { success: true, mode: "mock" };
    return { success: false, message: "Escrituras deshabilitadas en esta fase." };
  },

  async registrarReingreso(_payload: unknown): Promise<unknown> {
    if (!supabase) return { success: true, mode: "mock" };
    return { success: false, message: "Escrituras deshabilitadas en esta fase." };
  },

  async agregarStock(_payload: unknown): Promise<unknown> {
    if (!supabase) return { success: true, mode: "mock" };
    return { success: false, message: "Escrituras deshabilitadas en esta fase." };
  },

  async obtenerTodoElHistorico(): Promise<unknown[]> {
    if (!supabase) return movementsFixture;
    const { data, error } = await supabase.from("inventory_movements").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async obtenerMovimientosPorId(subModeloInventario: string): Promise<unknown> {
    if (!supabase) {
      const key = String(subModeloInventario || "").trim().toLowerCase();
      return movementDetailBySubModelFixture[key] || { producto: "Producto", sub: subModeloInventario, movimientos: [] };
    }
    return { producto: "Producto", sub: subModeloInventario, movimientos: [] };
  },

  async obtenerHistorialCombinado(): Promise<unknown[]> {
    if (!supabase) return historyFixture;
    return [];
  }
};
