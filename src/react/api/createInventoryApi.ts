import { createMockAdapter } from "./adapters/mockAdapter";
import { createSupabaseAdapter } from "./adapters/supabaseAdapter";
import type { InventoryApi } from "./types";

export type DataMode = "supabase" | "mock";

export function hasSupabaseConfig(): boolean {
  return Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
}

export function shouldUseMock(): boolean {
  const params = new URLSearchParams(window.location.search);
  return params.get("mock") === "1";
}

export function getDataMode(): DataMode {
  if (hasSupabaseConfig() && !shouldUseMock()) return "supabase";
  return "mock";
}

export function createInventoryApi(): InventoryApi {
  if (getDataMode() === "supabase") return createSupabaseAdapter();
  if (!hasSupabaseConfig()) {
    console.warn("[React API] Supabase no configurado, usando mockAdapter.");
  }
  return createMockAdapter();
}

export const inventoryApi = createInventoryApi();
