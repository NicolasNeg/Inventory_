import { createMockAdapter as createLegacyMockAdapter } from "../../../api/adapters/mockAdapter";
import type { InventoryApi } from "../types";

export function createMockAdapter(): InventoryApi {
  return createLegacyMockAdapter();
}
