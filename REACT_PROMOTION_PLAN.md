# React Promotion Plan (Option B -> Option A)

## Current State (Option B)

- Legacy app remains in `index.html` as operational fallback.
- React app is served from `react.html`.
- Netlify currently points SPA fallback to `react.html`.
- This allows iterative hardening without replacing legacy root yet.

## Promotion Goal (Option A)

Make React the primary app entry:

1. React root entry moves to `index.html`.
2. Legacy backup moves to `legacy.html`.
3. Netlify fallback points to React root entry.

## Safe Promotion Steps

1. **Freeze feature scope**
   - Only stabilization, no major new modules.
2. **Pre-checklist**
   - AppShell responsive stable.
   - AuthGate mock stable.
   - InventoryPage read-only stable (mock + supabase fallback).
   - No critical console/runtime errors.
3. **Entry switch**
   - Promote React entry file to `index.html`.
   - Archive legacy to `legacy.html`.
4. **Netlify update**
   - Keep publish directory.
   - Change redirect target from `/react.html` to `/index.html` (React entry).
5. **QA pass**
   - Route refresh on all major pages.
   - Login/logout flow.
   - Back/forward navigation.
   - No regression on data fallback.

## Rollback Plan

If issues are detected:

1. Revert to previous commit.
2. Restore Netlify redirect target to previous entry.
3. Verify legacy `index.html` is reachable.

## Pre-Production Checklist

- [ ] Typecheck/lint/build green
- [ ] Route refresh works in Netlify preview
- [ ] Mobile drawer stable
- [ ] No secrets in repository
- [ ] Supabase env configured in platform
- [ ] Legacy backup verified
