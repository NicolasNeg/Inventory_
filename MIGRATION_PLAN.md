# Migration Plan - Inventory_

## Estado actual del proyecto

- **Stack actual:** Google Apps Script (backend en `index.js`) + vistas HTML parciales con JS embebido.
- **Framework frontend:** no hay React/Vite/Webpack actualmente; UI basada en HTML + Tailwind CDN + Materialize CDN.
- **Fuente de datos:** Google Sheets (`INVENTARIO`, `HISTORICO`, `ADD_INSUMOS`, `HISTORICO_ADD_PRIMERINSUMO`, `HISTORIAL_NOTAS_PENDIENTES`, etc.).
- **Entrypoints actuales:**
  - `doGet()` en `index.js` (servidor Apps Script).
  - `index.html` (layout principal y navegación lateral).
  - vistas parciales: `inventario.html`, `nuevo.html`, `retiro.html`, `reingreso.html`, `stock.html`, `historial.html`, `historial_insumos.html`, `historial_movimientos.html`, `notas.html`, `reportes.html`.
- **Dependencias previas al plan:** no había `package.json`; proyecto sin toolchain local de build/lint.

## Riesgos encontrados

1. **Acoplamiento alto UI-datos:** lógica de UI y llamadas a `google.script.run` están mezcladas en cada vista.
2. **Estado global compartido:** uso intensivo de variables globales (`window.productoSeleccionadoParaFormulario`, `subModeloPendiente`, etc.).
3. **Sin tipado estático:** objetos de inventario/movimientos se construyen dinámicamente en múltiples sitios.
4. **Sin pruebas automáticas:** no existe suite test ni pipeline de validación automática.
5. **Dependencia fuerte de estructura de hojas:** cambios de columnas o nombres de hojas rompen funcionalidades.
6. **Riesgo de regresión visual/flujo:** cada vista tiene scripts inline, por lo que una migración brusca rompería interacciones.

## Funcionalidades existentes identificadas

- **Inventario general:** listado, búsqueda, alertas de stock, acciones rápidas (`inventario.html` + `index.js`).
- **Alta de producto/insumo:** captura de categoría, marca, modelo, periodo, stock inicial y mínimo (`nuevo.html`, `guardarProducto`).
- **Salida (retiro):** registro de salidas, actualización de stock y movimientos (`retiro.html`, `registrarRetiro`).
- **Reingreso:** devolución al inventario con ajuste de usados/disponible (`reingreso.html`, `registrarReingreso`).
- **Agregar stock:** recarga de inventario y log de cargas (`stock.html`, `agregarStock`).
- **Historiales:**
  - por producto (`historial.html`, `obtenerMovimientosPorId`),
  - global de movimientos (`historial_movimientos.html`, `obtenerTodoElHistorico`),
  - historial de altas/cargas (`historial_insumos.html`, `obtenerHistorialCombinado`).
- **Notas y alertas:** creación, seguimiento y resolución de notas vinculadas o generales (`notas.html`, `crearNuevaNota`, `resolverNota`).
- **Reportes:** generación de vista imprimible y exportación PDF (`reportes.html`, `generarReporteHTML`, `exportarHistorialPDF`).

## Plan de migración por fases (incremental y verificable)

### Actualización estratégica (React + Supabase + Netlify)

- Host final objetivo: Netlify con fallback SPA.
- Frontend objetivo: React + TypeScript + Vite.
- Datos objetivo: Supabase (sin service role key en frontend).
- Legacy (`index.html`) se mantiene temporalmente como referencia y fallback funcional.
- No se elimina legacy hasta contar con reemplazo React funcional por módulos.

### Fase 0 - Baseline seguro (completada en esta iteración)
- Crear documentación de migración (`MIGRATION_PLAN.md`).
- Inicializar toolchain local sin tocar UI productiva.
- Agregar TypeScript en modo progresivo (`strict: false`), ESLint, Prettier.
- Crear tipos base y contratos API en `src/shared/types`.
- Crear servicios desacoplados (`inventoryService`, `productService`) para preparar separación UI/data.
- Crear estructura feature-based inicial sin mover código existente.

### Fase 1 - Tipado progresivo de dominio (siguiente)
- Tipar mapeos de datos del backend Apps Script en módulos `.ts` puros (sin modificar HTML actual).
- Agregar adaptadores para convertir filas de Sheets a tipos (`Product`, `InventoryItem`, `InventoryMovement`).
- Validar entradas críticas con Zod en capas de servicio/adaptador.

### Fase 2 - Separación por capas en Apps Script
- Extraer lógica de acceso a hojas a repositorios (apps-script adapters).
- Mantener firmas públicas actuales para no romper `google.script.run`.
- Incorporar manejo de errores estándar y respuestas uniformes (`ApiResult<T>`).

### Fase 3 - Base React paralela (sin reemplazo inmediato)
- Crear app React/TypeScript en carpeta paralela (ej. `apps/web`) cuando sea aprobado.
- Implementar primero una sola pantalla no crítica consumiendo contratos ya definidos.
- Ejecutar coexistencia temporal: UI actual + nueva UI por feature flag/ruta separada.

### Fase 4 - Migración funcional por módulos
- Migrar módulos en orden de menor riesgo a mayor:
  1. reportes/consultas,
  2. historial,
  3. notas,
  4. movimientos (retiro/reingreso/stock),
  5. alta de productos/inventario.
- Mantener paridad funcional y checklist de regresión manual por módulo.

### Fase 5 - Preparación multi-plataforma
- Consolidar capa de dominio y servicios reutilizables.
- Definir contratos de backend real (REST/GraphQL) conservando tipos compartidos.
- Preparar consumo desde web, desktop y mobile sin duplicar reglas de negocio.

## Archivos que se tocarán en la primera fase

- `MIGRATION_PLAN.md`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `eslint.config.js`
- `.prettierrc.json`
- `src/shared/types/entities.ts`
- `src/shared/types/api.ts`
- `src/shared/types/index.ts`
- `src/shared/lib/validation/inventorySchemas.ts`
- `src/services/repositories.ts`
- `src/services/productService.ts`
- `src/services/inventoryService.ts`
- `src/features/products/.gitkeep`
- `src/features/inventory/.gitkeep`
- `src/features/auth/.gitkeep`
- `src/features/reports/.gitkeep`
- `src/shared/components/.gitkeep`
- `src/shared/hooks/.gitkeep`

## Archivos que NO deben tocarse todavía

- `index.js` (lógica productiva de Apps Script en producción).
- `index.html` (shell de navegación principal actual).
- Todas las vistas productivas actuales:
  - `inventario.html`
  - `nuevo.html`
  - `retiro.html`
  - `reingreso.html`
  - `stock.html`
  - `historial.html`
  - `historial_movimientos.html`
  - `historial_insumos.html`
  - `notas.html`
  - `reportes.html`

## Incertidumbres documentadas (sin asumir)

- No hay entorno local equivalente a `google.script.run` para ejecutar UI real fuera de Apps Script.
- No existe build/deploy pipeline local documentado para Apps Script.
- No está definido aún el contrato del backend futuro (REST, GraphQL, Firebase, etc.).
- No hay estrategia de versionado de esquema de Google Sheets, lo cual es crítico para una migración segura.
