# Netlify Deployment Guide

## Build Settings

- Build command: `npm run build`
- Publish directory: `dist-react`

Configured in `netlify.toml`.

## SPA Fallback

This project currently emits `react.html` as the React entry in `dist-react`.
Fallback is configured to route all requests to that entry:

```toml
[[redirects]]
  from = "/*"
  to = "/react.html"
  status = 200
```

## Environment Variables

Set these in Netlify site settings:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Use `.env.example` as template. Never store real values in git.

## Preview Deploy

1. Push branch.
2. Open Netlify deploy preview.
3. Validate:
   - route refresh
   - sidebar navigation
   - Supabase connectivity (if configured)

## Custom Domain

1. Add domain in Netlify dashboard.
2. Configure DNS records.
3. Validate HTTPS certificate.

## Rollback

- Use Netlify deploy history.
- Restore previous successful deploy instantly.
