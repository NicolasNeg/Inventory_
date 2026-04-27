# Inventory

## Current Architecture

- Legacy app remains available in `index.html` (reference + transition safety).
- New app scaffold is in `src/react` (React + TypeScript + Vite).
- Data strategy in new app:
  - Supabase adapter when env is configured.
  - Mock adapter for demo/fallback mode.

### Entry Strategy (Current)

- **Opción B activa:** `index.html` legacy intacto como respaldo.
- React se prueba en `react.html` mientras se estabiliza AppShell + InventoryPage.
- Plan futuro (**Opción A**): promover React a `index.html` y mover legacy a `legacy.html`.

## Commands

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run typecheck`
- `npm run lint`

## Routing

- Legacy routing strategy: see `ROUTING.md`
- React routing paths:
  - `/inventario`
  - `/notas`
  - `/nuevo`
  - `/historial-cargas`
  - `/log-general`
  - `/mapa-almacen`
  - `/autorizaciones`
  - `/gestion-usuarios`

## Supabase

- Setup docs: `SUPABASE_MIGRATION_PLAN.md`
- SQL scaffold: `supabase/schema.sql`
- Env template: `.env.example`

## Netlify

- Deploy docs: `NETLIFY_DEPLOYMENT.md`
- Config: `netlify.toml`
