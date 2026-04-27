import { createAppsScriptAdapter } from "./adapters/appsScriptAdapter";
import { createHttpAdapter } from "./adapters/httpAdapter";
import { createMockAdapter } from "./adapters/mockAdapter";
import type { InventoryApi } from "./types";

function hasAppsScriptRuntime(): boolean {
  const googleObj = (window as unknown as { google?: { script?: { run?: unknown } } }).google;
  return Boolean(googleObj?.script?.run);
}

/** `?mock=1` fuerza demo sin importar host (útil para GitHub Pages). */
function hasForcedMockQuery(): boolean {
  return new URLSearchParams(window.location.search).get("mock") === "1";
}

/**
 * Entornos demo sin backend: GitHub Pages estático, localhost, file.
 * Solo aplica si no hay `__INVENTORY_API_BASE_URL__` (esa ruta tiene prioridad).
 */
function isDemoFallbackEnvironment(): boolean {
  const host = window.location.hostname;
  const protocol = window.location.protocol;
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    protocol === "file:" ||
    host.endsWith("github.io")
  );
}

export function createInventoryApi(): InventoryApi {
  if (hasAppsScriptRuntime()) return createAppsScriptAdapter();
  if (hasForcedMockQuery()) return createMockAdapter();
  if (window.__INVENTORY_API_BASE_URL__) return createHttpAdapter(window.__INVENTORY_API_BASE_URL__);
  if (isDemoFallbackEnvironment()) return createMockAdapter();

  throw new Error("No API adapter available. Use mock mode, Apps Script, or configure API_BASE_URL.");
}
