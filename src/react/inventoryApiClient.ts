import { createInventoryApi } from "../api/createInventoryApi";

/**
 * Instancia única para la shell React (misma lógica que `inventoryApi.global.js` en legacy).
 * No usar `google.script.run` fuera de `appsScriptAdapter`.
 */
export const inventoryApi = createInventoryApi();
