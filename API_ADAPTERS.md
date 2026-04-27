# Inventory API adapters

La UI usa **`window.inventoryApi`** (promesas). No debe llamar a `google.script.run` directamente.

Implementación cargada en el navegador: [`src/api/inventoryApi.global.js`](src/api/inventoryApi.global.js).

La versión TypeScript equivalente para tooling y futuro bundler/React está en [`src/api/createInventoryApi.ts`](src/api/createInventoryApi.ts).

---

## Prioridad de selección (orden fijo)

| Orden | Condición | Adapter |
|-----|-----------|---------|
| 1 | Existe `window.google?.script?.run` | **Apps Script** (`appsScriptAdapter`) — backend real en Sheets vía HtmlService |
| 2 | Query `?mock=1` | **Mock** forzado (`mockAdapter`) — demo / pruebas UI |
| 3 | Existe `window.__INVENTORY_API_BASE_URL__` | **HTTP** (`httpAdapter`) — backend futuro |
| 4 | Host demo: `localhost`, `127.0.0.1`, `file:` o `*.github.io` | **Mock** como fallback cuando no hay API configurada |

Si no aplica ninguna opción válida → error:

```text
No API adapter available. Use mock mode, Apps Script, or configure API_BASE_URL.
```

---

## Por entorno

### Google Apps Script (HtmlService)

- Se usa **`appsScriptAdapter`**.
- Es la única capa del frontend donde se envuelve `google.script.run` (en código TypeScript: [`appsScriptAdapter.ts`](src/api/adapters/appsScriptAdapter.ts)).

### GitHub Pages sin backend propio

- Sin `__INVENTORY_API_BASE_URL__`: cae en **mock** por regla 4 (`*.github.io`).
- Con **`?mock=1`**: **mock** explícito por regla 2 (antes de comprobar HTTP).

### GitHub Pages + API real (futuro)

Antes de cargar [`inventoryApi.global.js`](src/api/inventoryApi.global.js), definir:

```js
window.__INVENTORY_API_BASE_URL__ = "https://tu-api.example.com";
```

Entonces se usa **`httpAdapter`** (regla 3), siempre que no exista Apps Script y no se fuerce `?mock=1`.

---

## Roles de cada adapter

| Adapter | Uso |
|--------|-----|
| **appsScriptAdapter** | Producción dentro de Spreadsheet / Apps Script |
| **mockAdapter** | Demo estático, tests de UI, datos fake; escrituras solo simuladas (`console.warn`) |
| **httpAdapter** | Contrato preparado para backend REST futuro (`POST /api/:method`) |

---

## Documentación relacionada

- Pruebas locales y GitHub Pages: [`LOCAL_TESTING.md`](LOCAL_TESTING.md)
