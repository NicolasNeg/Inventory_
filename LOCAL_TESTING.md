# Local Testing (Inventory API + Mock Adapter)

## Objetivo

Permitir pruebas de UI local sin entorno de Google Apps Script, evitando el error:

`Uncaught ReferenceError: google is not defined`

## Como se elige el adapter

La prioridad está documentada en **[API_ADAPTERS.md](./API_ADAPTERS.md)**. Resumen:

1. Apps Script (`window.google.script.run`) → backend real en Sheets.
2. `?mock=1` → mock forzado (demo).
3. `window.__INVENTORY_API_BASE_URL__` → HTTP (backend futuro); en GitHub Pages permite **no** quedar atado al mock.
4. Sin API configurada en `localhost`, `file:`, `*.github.io` → mock como fallback/demo.

El mock **no** sustituye a Apps Script cuando la app corre dentro de HtmlService.

## Archivos relevantes

- `src/api/inventoryApi.global.js`
- `src/api/createInventoryApi.ts`
- `src/api/adapters/appsScriptAdapter.ts`
- `src/api/adapters/mockAdapter.ts`
- `src/api/adapters/httpAdapter.ts`
- `src/dev/fixtures/products.fixture.ts`
- `src/dev/fixtures/movements.fixture.ts`
- `src/dev/fixtures/history.fixture.ts`
- `src/dev/fixtures/notes.fixture.ts`

## Metodos mock soportados

### Lectura

- `cargarVistaParcial`
- `obtenerProductos`
- `obtenerMovimientosPorId`
- `obtenerTodoElHistorico`
- `obtenerHistorialCombinado`
- `obtenerNotasHistorial`

### Escritura (simulada, no persistente)

- `guardarProducto`
- `registrarRetiro`
- `registrarReingreso`
- `agregarStock`
- `crearNuevaNota`
- `resolverNota`

Las funciones de escritura muestran `console.warn` indicando que no escriben en base real.

## Flujo recomendado de prueba (GitHub Pages)

1. Abrir la URL publicada (mock explícito opcional):
   - `https://NicolasNeg.github.io/Inventory_/?mock=1`

   También funcionará sin `mock=1` en `*.github.io` usando mock como fallback **si no** definiste `window.__INVENTORY_API_BASE_URL__`.
2. Confirmar en consola que no aparece `google is not defined`.
3. Validar inventario:
   - carga de tabla,
   - buscador,
   - acciones rapidas.
4. Abrir historial por producto.
5. Abrir historial global y notas.

## Nota sobre `file://`

- `file://` no es el metodo recomendado para esta app por restricciones de CORS en navegadores.
- Priorizar pruebas en GitHub Pages o servidor local HTTP.

## Limites del mock (validar solo en Apps Script real)

- Persistencia real en hojas Google Sheets.
- Integridad de formulas/rangos reales por columna.
- Formato exacto de fechas de `Utilities.formatDate` en todos los casos.
- Flujos de escritura end-to-end (`appendRow`, `setValue`, `setValues`).
- Menus/modales de Spreadsheet UI (`SpreadsheetApp.getUi()`).
