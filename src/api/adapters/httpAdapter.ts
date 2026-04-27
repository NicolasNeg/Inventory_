import type { ApiAdapter } from "../types";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

async function request(baseUrl: string, method: string, payload?: JsonValue): Promise<unknown> {
  const response = await fetch(new URL(`/api/${method}`, baseUrl).toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payload })
  });

  if (!response.ok) throw new Error(`HTTP adapter error: ${response.status}`);
  return response.json();
}

export function createHttpAdapter(baseUrl: string): ApiAdapter {
  return {
    cargarVistaParcial: (nombreVista) => request(baseUrl, "cargarVistaParcial", nombreVista) as Promise<string>,
    obtenerCategoriasParaSelect: () => request(baseUrl, "obtenerCategoriasParaSelect") as Promise<unknown[]>,
    insertarNuevoModeloAuto: (payload) => request(baseUrl, "insertarNuevoModeloAuto", payload as JsonValue),
    obtenerAutosParaSelect: () => request(baseUrl, "obtenerAutosParaSelect") as Promise<unknown[]>,
    obtenerProductos: () => request(baseUrl, "obtenerProductos") as Promise<unknown[]>,
    obtenerProductosSalida: () => request(baseUrl, "obtenerProductosSalida") as Promise<unknown[]>,
    obtenerProductosReingreso: () => request(baseUrl, "obtenerProductosReingreso") as Promise<unknown[]>,
    obtenerProductosParaAgregar: () => request(baseUrl, "obtenerProductosParaAgregar") as Promise<unknown[]>,
    guardarProducto: (payload) => request(baseUrl, "guardarProducto", payload as JsonValue),
    registrarRetiro: (payload) => request(baseUrl, "registrarRetiro", payload as JsonValue),
    registrarReingreso: (payload) => request(baseUrl, "registrarReingreso", payload as JsonValue),
    agregarStock: (payload) => request(baseUrl, "agregarStock", payload as JsonValue),
    obtenerTodoElHistorico: () => request(baseUrl, "obtenerTodoElHistorico") as Promise<unknown[] | unknown>,
    obtenerMovimientosPorId: (subModeloInventario) =>
      request(baseUrl, "obtenerMovimientosPorId", subModeloInventario),
    obtenerHistorialCombinado: () => request(baseUrl, "obtenerHistorialCombinado") as Promise<unknown[]>,
    obtenerNotasHistorial: () => request(baseUrl, "obtenerNotasHistorial") as Promise<unknown[]>,
    obtenerListaProductosSimplificada: () => request(baseUrl, "obtenerListaProductosSimplificada") as Promise<unknown[]>,
    crearNuevaNota: (payload) => request(baseUrl, "crearNuevaNota", payload as JsonValue),
    resolverNota: (payload) => request(baseUrl, "resolverNota", payload as JsonValue),
    obtenerDetalleNotaPorId: (idNota) => request(baseUrl, "obtenerDetalleNotaPorId", idNota),
    generarReporteHTML: (payload) => request(baseUrl, "generarReporteHTML", payload) as Promise<string>,
    exportarHistorialPDF: (payload) => request(baseUrl, "exportarHistorialPDF", payload as JsonValue) as Promise<string>
  };
}
