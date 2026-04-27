import { createInventoryApi } from "./createInventoryApi";

export const inventoryApi = createInventoryApi();

if (typeof window !== "undefined") {
  window.inventoryApi = inventoryApi;
}
