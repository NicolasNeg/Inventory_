import { historyFixture } from "../../dev/fixtures/history.fixture";
import { movementDetailBySubModelFixture, movementsFixture } from "../../dev/fixtures/movements.fixture";
import { notesFixture } from "../../dev/fixtures/notes.fixture";
import { productsFixture } from "../../dev/fixtures/products.fixture";
import type { ApiAdapter } from "../types";

const partialMap: Record<string, string> = {
  inventario: "inventario.html",
  nuevo: "nuevo.html",
  retiro: "retiro.html",
  reingreso: "reingreso.html",
  stock: "stock.html",
  historial: "historial.html",
  historialinsumos: "historial_insumos.html",
  historial_movimientos: "historial_movimientos.html",
  notas: "notas.html",
  reportes: "reportes.html"
};

const state = {
  products: [...productsFixture],
  notes: [...notesFixture]
};

function warnWrite(operation: string): void {
  console.warn(`[MOCK] operación simulada: ${operation}`);
}

async function fetchPartial(nombreVista: string): Promise<string> {
  const file = partialMap[nombreVista] || `${nombreVista}.html`;
  const partialUrl = new URL(file, window.location.href);
  const response = await fetch(partialUrl.toString());
  if (!response.ok) throw new Error(`No se pudo cargar la vista parcial: ${file}`);
  return response.text();
}

export function createMockAdapter(): ApiAdapter {
  return {
    cargarVistaParcial: (nombreVista) => fetchPartial(nombreVista),
    obtenerCategoriasParaSelect: async () => ["FILTROS", "FRENOS", "ACEITES"],
    insertarNuevoModeloAuto: async (payload: string) => ({ success: true, modelo: String(payload || "").toUpperCase() }),
    obtenerAutosParaSelect: async () => ["VERSA", "MARCH", "SENTRA", "TIIDA"],
    obtenerProductos: async () => state.products,
    obtenerProductosSalida: async () => state.products,
    obtenerProductosReingreso: async () => state.products,
    obtenerProductosParaAgregar: async () => state.products,
    guardarProducto: async () => {
      warnWrite("guardarProducto");
      return { success: true, mensaje: "MOCK: Producto simulado correctamente." };
    },
    registrarRetiro: async () => {
      warnWrite("registrarRetiro");
      return { status: "success", operacion: "retiro" };
    },
    registrarReingreso: async () => {
      warnWrite("registrarReingreso");
      return true;
    },
    agregarStock: async () => {
      warnWrite("agregarStock");
      return { status: "success", operacion: "carga" };
    },
    obtenerTodoElHistorico: async () => movementsFixture,
    obtenerMovimientosPorId: async (subModeloInventario: string) => {
      const key = String(subModeloInventario || "").trim().toLowerCase();
      return movementDetailBySubModelFixture[key] || { producto: "Producto", sub: subModeloInventario, movimientos: [] };
    },
    obtenerHistorialCombinado: async () => historyFixture,
    obtenerNotasHistorial: async () => state.notes,
    obtenerListaProductosSimplificada: async () =>
      state.products.map((p) => ({ idOrden: p.idOrden, nombre: `${p.producto} | ${p.subModelo}` })),
    crearNuevaNota: async () => {
      warnWrite("crearNuevaNota");
      return { success: true };
    },
    resolverNota: async () => {
      warnWrite("resolverNota");
      return { success: true };
    },
    obtenerDetalleNotaPorId: async (idNota: string) => {
      const found = state.notes.find((n) => String(n.idNota) === String(idNota));
      if (!found) return { success: false, error: "Nota no encontrada" };
      return {
        success: true,
        idNota: found.idNota,
        fecha: found.fecha,
        autor: found.autor,
        unidad: found.unidad,
        nota: found.nota,
        estado: found.estado,
        idFila: found.idFila
      };
    },
    generarReporteHTML: async (payload: string) => {
      return `<html><body><h3>MOCK REPORTE ${payload}</h3><p>Reporte simulado.</p></body></html>`;
    },
    exportarHistorialPDF: async () => "data:application/pdf;base64,JVBERi0xLjQKJcTl8uXr"
  };
}
