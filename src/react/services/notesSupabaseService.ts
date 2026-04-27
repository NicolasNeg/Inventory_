import { notesFixture } from "../../dev/fixtures/notes.fixture";
import { supabase } from "../lib/supabaseClient";

export const notesSupabaseService = {
  async obtenerNotasHistorial(): Promise<unknown[]> {
    if (!supabase) return notesFixture;
    const { data, error } = await supabase.from("notes").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async crearNuevaNota(_payload: unknown): Promise<unknown> {
    if (!supabase) return { success: true, mode: "mock" };
    return { success: false, message: "Escrituras deshabilitadas hasta validar reglas." };
  },

  async resolverNota(_payload: unknown): Promise<unknown> {
    if (!supabase) return { success: true, mode: "mock" };
    return { success: false, message: "Escrituras deshabilitadas hasta validar reglas." };
  },

  async obtenerDetalleNotaPorId(idNota: string): Promise<unknown> {
    if (!supabase) {
      const found = notesFixture.find((n) => String(n.idNota) === String(idNota));
      return found ? { success: true, ...found, idFila: found.idFila } : { success: false, error: "Nota no encontrada" };
    }
    const { data, error } = await supabase.from("notes").select("*").eq("id", idNota).maybeSingle();
    if (error) throw error;
    if (!data) return { success: false, error: "Nota no encontrada" };
    const noteData = data as Record<string, unknown>;
    return { success: true, ...noteData };
  }
};
