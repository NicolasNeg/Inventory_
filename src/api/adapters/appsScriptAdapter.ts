import type { ApiAdapter } from "../types";

interface AppsScriptRunner {
  withSuccessHandler(handler: (value: unknown) => void): AppsScriptRunner;
  withFailureHandler(handler: (error: unknown) => void): AppsScriptRunner;
  [method: string]: unknown;
}

function getAppsScriptRun(): AppsScriptRunner | undefined {
  const globalWindow = window as unknown as { google?: { script?: { run?: AppsScriptRunner } } };
  return globalWindow.google?.script?.run;
}

function callAppsScript(functionName: string, ...args: unknown[]): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const run = getAppsScriptRun();
    if (!run) {
      reject(new Error("Apps Script runtime unavailable."));
      return;
    }

    const chain = run.withSuccessHandler(resolve).withFailureHandler(reject);
    const method = chain[functionName] as ((...innerArgs: unknown[]) => void) | undefined;
    if (!method) {
      reject(new Error(`Apps Script function not found: ${functionName}`));
      return;
    }
    method(...args);
  });
}

export function createAppsScriptAdapter(): ApiAdapter {
  return {
    cargarVistaParcial: (nombreVista) => callAppsScript("cargarVistaParcial", nombreVista) as Promise<string>,
    obtenerCategoriasParaSelect: () => callAppsScript("obtenerCategoriasParaSelect") as Promise<unknown[]>,
    insertarNuevoModeloAuto: (payload) => callAppsScript("insertarNuevoModeloAuto", payload),
    obtenerAutosParaSelect: () => callAppsScript("obtenerAutosParaSelect") as Promise<unknown[]>,
    obtenerProductos: () => callAppsScript("obtenerProductos") as Promise<unknown[]>,
    obtenerProductosSalida: () => callAppsScript("obtenerProductosSalida") as Promise<unknown[]>,
    obtenerProductosReingreso: () => callAppsScript("obtenerProductosReingreso") as Promise<unknown[]>,
    obtenerProductosParaAgregar: () => callAppsScript("obtenerProductosParaAgregar") as Promise<unknown[]>,
    guardarProducto: (payload) => callAppsScript("guardarProducto", payload),
    registrarRetiro: (payload) => callAppsScript("registrarRetiro", payload),
    registrarReingreso: (payload) => callAppsScript("registrarReingreso", payload),
    agregarStock: (payload) => callAppsScript("agregarStock", payload),
    obtenerTodoElHistorico: () => callAppsScript("obtenerTodoElHistorico") as Promise<unknown[] | unknown>,
    obtenerMovimientosPorId: (subModeloInventario) =>
      callAppsScript("obtenerMovimientosPorId", subModeloInventario),
    obtenerHistorialCombinado: () => callAppsScript("obtenerHistorialCombinado") as Promise<unknown[]>,
    obtenerNotasHistorial: () => callAppsScript("obtenerNotasHistorial") as Promise<unknown[]>,
    obtenerListaProductosSimplificada: () => callAppsScript("obtenerListaProductosSimplificada") as Promise<unknown[]>,
    crearNuevaNota: (payload) => callAppsScript("crearNuevaNota", payload),
    resolverNota: (payload) => callAppsScript("resolverNota", payload),
    obtenerDetalleNotaPorId: (idNota) => callAppsScript("obtenerDetalleNotaPorId", idNota),
    generarReporteHTML: (payload) => callAppsScript("generarReporteHTML", payload) as Promise<string>,
    exportarHistorialPDF: () => callAppsScript("exportarHistorialPDF") as Promise<string>
  };
}
