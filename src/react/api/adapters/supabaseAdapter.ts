import { inventorySupabaseService } from "../../services/inventorySupabaseService";
import { movementSupabaseService } from "../../services/movementSupabaseService";
import { notesSupabaseService } from "../../services/notesSupabaseService";
import type { InventoryApi } from "../types";

export function createSupabaseAdapter(): InventoryApi {
  return {
    cargarVistaParcial: async () => "<div>Vista parcial no aplica en React.</div>",
    obtenerCategoriasParaSelect: () => inventorySupabaseService.obtenerCategorias(),
    insertarNuevoModeloAuto: async (payload: string) => ({ success: true, modelo: payload }),
    obtenerAutosParaSelect: async () => [],
    obtenerProductos: () => inventorySupabaseService.obtenerProductos(),
    obtenerProductosSalida: () => inventorySupabaseService.obtenerProductos(),
    obtenerProductosReingreso: () => inventorySupabaseService.obtenerProductos(),
    obtenerProductosParaAgregar: () => inventorySupabaseService.obtenerProductos(),
    guardarProducto: (payload: unknown) => inventorySupabaseService.guardarProducto(payload),
    registrarRetiro: (payload: unknown) => movementSupabaseService.registrarRetiro(payload),
    registrarReingreso: (payload: unknown) => movementSupabaseService.registrarReingreso(payload),
    agregarStock: (payload: unknown) => movementSupabaseService.agregarStock(payload),
    obtenerTodoElHistorico: () => movementSupabaseService.obtenerTodoElHistorico(),
    obtenerMovimientosPorId: (subModeloInventario: string) =>
      movementSupabaseService.obtenerMovimientosPorId(subModeloInventario),
    obtenerHistorialCombinado: () => movementSupabaseService.obtenerHistorialCombinado(),
    obtenerNotasHistorial: () => notesSupabaseService.obtenerNotasHistorial(),
    obtenerListaProductosSimplificada: () => inventorySupabaseService.obtenerListaProductosSimplificada(),
    crearNuevaNota: (payload: unknown) => notesSupabaseService.crearNuevaNota(payload),
    resolverNota: (payload: unknown) => notesSupabaseService.resolverNota(payload),
    obtenerDetalleNotaPorId: (idNota: string) => notesSupabaseService.obtenerDetalleNotaPorId(idNota),
    generarReporteHTML: async (payload: string) => `<html><body><h3>${payload}</h3><p>Reporte pendiente.</p></body></html>`,
    exportarHistorialPDF: async () => "data:application/pdf;base64,JVBERi0xLjQKJcTl8uXr"
  };
}
