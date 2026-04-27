# Local Testing (Mock de `google.script.run`)

## Objetivo

Permitir pruebas de UI local sin entorno de Google Apps Script, evitando el error:

`Uncaught ReferenceError: google is not defined`

## Como se activa el mock

El mock se activa **solo** cuando:

- `file://...`
- `http://localhost...` o `http://127.0.0.1...`
- URL con `?mock=1`
- host `*.github.io`

En Apps Script real (HTML Service), se usa `google.script.run` real y el mock **no** interfiere.
Si `window.google?.script?.run` ya existe, el mock no se instala.

## Archivos

- `src/dev/googleScriptRunMock.ts`
- `src/dev/installGoogleScriptRunMock.ts`
- `src/dev/mockRuntime.js` (runtime directo para navegador local)
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

1. Abrir la URL publicada con mock:
   - `https://NicolasNeg.github.io/Inventory_/?mock=1`
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
