# Legacy Routing Strategy

This project keeps the legacy HTML shell (`index.html`) and adds a route layer that works in two modes:

- `history` mode (preferred for real hosting with fallback to `index.html`)
- `hash` mode (fallback for static environments without server rewrites)

## Why History Mode For Real Host

For production host + custom domain, clean URLs are required:

- `/inventario`
- `/nuevo`
- `/notas`
- `/historial-cargas`
- `/log-general`
- `/mapa-almacen`
- `/autorizaciones`
- `/gestion-usuarios`

This uses `history.pushState` and browser `popstate` for back/forward navigation.

## Why Hash Fallback Exists

Static hosts without rewrite fallback cannot serve deep links directly. Hash mode keeps routes working by using:

- `#/inventario`
- `#/nuevo`
- etc.

This mode listens to `hashchange` and does not require server configuration.

## Runtime Configuration

Optional globals before app bootstrap:

```html
<script>
  window.__INVENTORY_ROUTER_MODE__ = "auto"; // "auto" | "history" | "hash"
  window.__INVENTORY_BASE_PATH__ = "/";      // e.g "/" or "/Inventory_/"
</script>
```

Behavior:

- `history`: always use clean URLs
- `hash`: always use hash URLs
- `auto`: use `history` by default, fallback to `hash` on static-like environments (e.g. `file:` and `*.github.io`)

`__INVENTORY_BASE_PATH__` defines where the app is mounted:

- `/` for root domain
- `/Inventory_/` for temporary static subpath
- `/my/custom/path/` for other hosts

## Route Map

Sidebar/main routes:

- `inventario` -> `inventario.html`
- `notas` -> `notas.html`
- `nuevo` -> `nuevo.html`
- `historial-cargas` -> `historialinsumos.html`
- `log-general` -> `historial_movimientos.html`
- `mapa-almacen` -> `mapa_almacen.html`
- `autorizaciones` -> `autorizaciones.html`
- `gestion-usuarios` -> `gestion_usuarios.html`

## Host Fallback Examples

### Netlify

`_redirects`:

```txt
/* /index.html 200
```

### Vercel

`vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Nginx

```nginx
location / {
  try_files $uri /index.html;
}
```

### Apache

`.htaccess`:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```
