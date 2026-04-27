# Supabase Migration Plan

## Goal

Move from temporary mock data to real Supabase-backed data while keeping the legacy UI functional during transition.

## Security Rules

- Frontend uses **only**:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Never commit service role keys.
- Do not expose secrets in code, commits, or docs.

## Status

- Supabase client scaffolded in `src/react/lib/supabaseClient.ts`
- Database shape scaffolded in `src/react/types/database.types.ts`
- Initial SQL schema in `supabase/schema.sql`
- Optional seed in `supabase/seed.sql`
- Services scaffolded:
  - `inventorySupabaseService.ts`
  - `movementSupabaseService.ts`
  - `notesSupabaseService.ts`
  - `authSupabaseService.ts`

## Phased Rollout

1. **Read-only phase**
   - Keep writes disabled in services.
   - Validate table structures and joins.
2. **Auth and roles**
   - Add profile + role policies.
   - Validate RLS with anon/authenticated users.
3. **Write enablement**
   - Enable writes module by module:
     - products
     - movements
     - notes
     - authorizations
4. **Audit**
   - Log critical changes to `audit_logs`.

## RLS Note

RLS is enabled in schema for critical tables. Policies should be added before production write enablement.
