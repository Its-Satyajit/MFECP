# `@repo/product-app` — Product Micro-Frontend

Owns product browsing domain: catalog listing with search and category filter, and product detail view.

## Exports

| Export | Source |
|---|---|
| `ProductsPage` | `src/features/products.tsx` |
| `ProductPage` | `src/features/product.tsx` |
| `productRoutes` | `src/remote-routes.tsx` |

## Federation

Exposes `./product` via `@module-federation/vite`. Produces `remoteEntry.js` at build time. Loaded by Shell as a runtime remote.

## Features

- **Full-text search** — Client-side FlexSearch across product names and descriptions
- **Category filter** — Dropdown to narrow by product category
- **Related products** — Same-category suggestions on the product detail page
- **Auth gate on Add to Bag** — Redirects unauthenticated users to login

## Dev

```bash
pnpm --filter @repo/product-app dev    # Standalone on :3002
```

## See Also

- [Data Flow](../../docs/architecture.md#data-flow-and-query-pattern) — product fetching and caching
- [Domain Glossary](../../CONTEXT.md) — Product definition
