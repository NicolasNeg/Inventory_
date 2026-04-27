import { createMockAdapter } from "./adapters/mockAdapter";
import { createSupabaseAdapter } from "./adapters/supabaseAdapter";
import type { InventoryApi } from "./types";

function hasSupabaseConfig(): boolean {
  return Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
}

function shouldUseMock(): boolean {
  const params = new URLSearchParams(window.location.search);
  return params.get("mock") === "1";
}

export function createInventoryApi(): InventoryApi {
  if (hasSupabaseConfig() && !shouldUseMock()) return createSupabaseAdapter();
  return createMockAdapter();
}

export const inventoryApi = createInventoryApi();
