export interface InventoryApi {
  cargarVistaParcial(nombreVista: string): Promise<string>;
  obtenerCategoriasParaSelect(): Promise<unknown[]>;
  insertarNuevoModeloAuto(payload: string): Promise<unknown>;
  obtenerAutosParaSelect(): Promise<unknown[]>;
  obtenerProductos(): Promise<unknown[]>;
  obtenerProductosSalida(): Promise<unknown[]>;
  obtenerProductosReingreso(): Promise<unknown[]>;
  obtenerProductosParaAgregar(): Promise<unknown[]>;
  guardarProducto(payload: unknown): Promise<unknown>;
  registrarRetiro(payload: unknown): Promise<unknown>;
  registrarReingreso(payload: unknown): Promise<unknown>;
  agregarStock(payload: unknown): Promise<unknown>;
  obtenerTodoElHistorico(): Promise<unknown[] | unknown>;
  obtenerMovimientosPorId(subModeloInventario: string): Promise<unknown>;
  obtenerHistorialCombinado(): Promise<unknown[]>;
  obtenerNotasHistorial(): Promise<unknown[]>;
  obtenerListaProductosSimplificada(): Promise<unknown[]>;
  crearNuevaNota(payload: unknown): Promise<unknown>;
  resolverNota(payload: unknown): Promise<unknown>;
  obtenerDetalleNotaPorId(idNota: string): Promise<unknown>;
  generarReporteHTML(payload: string): Promise<string>;
  exportarHistorialPDF(payload?: unknown): Promise<string>;
}
