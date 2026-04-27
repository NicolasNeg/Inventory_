# Apps Script API Map (google.script.run)

Funciones auditadas desde llamadas reales en HTML (`google.script.run`) y su estado actual en `index.js`.

| Funcion publica | Archivo | Parametros actuales | Respuesta actual | Consumido por | Lee/Escribe Sheets | Riesgo de cambio |
|---|---|---|---|---|---|---|
| `cargarVistaParcial` | `index.js` | `nombre: string` | `string` (HTML parcial) | `index.html` | No | Alto (rompe navegacion) |
| `obtenerProductos` | `index.js` | Sin parametros | `Array<object>` | `index.html` (vista inventario) | Lee `INVENTARIO` | Alto |
| `obtenerHistorialCombinado` | `index.js` | Sin parametros | `Array<object>` | `index.html` (`historialinsumos`), `historial_insumos.html` | Lee `HISTORICO_ADD_PRIMERINSUMO`, `ADD_INSUMOS` | Medio-Alto |
| `obtenerMovimientosPorId` | `index.js` | `subModeloInventario: string` | `{ producto, sub, movimientos[] }` o `{ error }` | `historial.html` (via `index.html`) | Lee `INVENTARIO`, `HISTORICO` | Alto |
| `obtenerTodoElHistorico` | `index.js` | Sin parametros | `Array<object>` o `{ error }` | `historial_movimientos.html` | Lee `HISTORICO` | Medio |
| `obtenerCategoriasParaSelect` | `index.js` | Sin parametros | `string[]` | `nuevo.html` | Lee `CONFIG_ORDEN_TIPO_PRODUCTO` | Medio |
| `obtenerAutosParaSelect` | `index.js` | Sin parametros | `string[]` | `nuevo.html` | Lee `MODELOS_UNIDADES` | Medio |
| `insertarNuevoModeloAuto` | `index.js` | `nuevoModelo: string` | `{ success, msg? , modelo? }` | `nuevo.html` | Lee/Escribe `MODELOS_UNIDADES` | Medio |
| `guardarProducto` | `index.js` | `datos: object` | `{ success, mensaje }` | `nuevo.html` | Escribe `INVENTARIO`, `HISTORICO_ADD_PRIMERINSUMO`; lee `CONFIG_ORDEN_TIPO_PRODUCTO` | Alto |
| `obtenerProductosSalida` | `index.js` | Sin parametros | `Array<object>` | `retiro.html` | Lee `INVENTARIO` | Alto |
| `registrarRetiro` | `index.js` | `d: object` | `{ status, operacion }` (o error) | `retiro.html` | Escribe `HISTORICO`, actualiza `INVENTARIO` | Alto |
| `obtenerProductosReingreso` | `index.js` | Sin parametros | `Array<object>` | `reingreso.html` | Lee `INVENTARIO` | Alto |
| `registrarReingreso` | `index.js` | `d: object` | `true` (o error) | `reingreso.html` | Escribe `HISTORICO`, actualiza `INVENTARIO` | Alto |
| `obtenerProductosParaAgregar` | `index.js` | Sin parametros | `Array<object>` | `stock.html` | Lee `INVENTARIO` | Alto |
| `agregarStock` | `index.js` | `d: object` | `{ status, operacion }` (o error) | `stock.html` | Escribe `ADD_INSUMOS`, actualiza `INVENTARIO` | Alto |
| `generarReporteHTML` | `index.js` | `tipoHoja: string` | `string` (HTML) | `reportes.html`, `notas.html` (`HISTORIAL_NOTAS_PENDIENTES`) | Lee hoja segun `tipoHoja` | Medio-Alto |
| `exportarHistorialPDF` | `index.js` | Sin parametros | `string` Data URL Base64 PDF | `historial_insumos.html` | Lee datos via `obtenerHistorialCombinado` | Medio |
| `obtenerNotasHistorial` | `index.js` | Sin parametros | `Array<object>` | `notas.html` | Lee `HISTORIAL_NOTAS_PENDIENTES` | Medio |
| `crearNuevaNota` | `index.js` | `d: object` | `{ success: true }` | `notas.html` | Escribe `HISTORIAL_NOTAS_PENDIENTES`, actualiza `INVENTARIO` (N/O) | Alto |
| `resolverNota` | `index.js` | `d: { idFila, autorRes, solucion }` | `{ success: true }` | `notas.html` | Escribe `HISTORIAL_NOTAS_PENDIENTES` | Medio |
| `obtenerListaProductosSimplificada` | `index.js` | Sin parametros | `Array<{idOrden,nombre}>` | `notas.html` | Lee `INVENTARIO` | Bajo-Medio |
| `obtenerDetalleNotaPorId` | `index.js` | `idNota: string` | `{ success, ... }` | `index.html` (modal alerta) | Lee `HISTORIAL_NOTAS_PENDIENTES` | Medio |

## Observaciones de compatibilidad

- En esta fase **no se modifican** nombres, parametros ni forma de respuesta de estas funciones.
- `google.script.run` mantiene los mismos contratos actuales.
- Cualquier encapsulamiento nuevo se implementa en capa separada (tipada) para adopcion progresiva.
