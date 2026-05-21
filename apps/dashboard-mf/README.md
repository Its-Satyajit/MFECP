# `@repo/dashboard-mf` — Dashboard Micro-Frontend

Owns analytics domain: metrics hub with product statistics, revenue snapshots, and category breakdowns.

## Exports

| Export | Source |
|---|---|
| `DashboardPage` | `src/features/dashboard.tsx` |
| `dashboardRoutes` | `src/remote-routes.tsx` |

## Federation

Exposes `./dashboard` via `@module-federation/vite`. Produces `remoteEntry.js` at build time. Loaded by Shell as a runtime remote.

## Features

- **Product stats** — Total products, categories, average price and rating
- **Revenue metrics** — Total orders, revenue, average order value
- **Top-rated products** — Highest-rated items from the catalog
- **Recent registrations** — Latest authenticated users from the local DB
- **Protected** — Requires authentication (Shell enforces via `beforeLoad` guard)

## Dev

```bash
pnpm --filter @repo/dashboard-mf dev    # Standalone on :3005
```

## See Also

- [Dashboard Aggregation Flow](../../docs/architecture.md#dashboard-aggregation-flow) — full diagram (jsoning.com stats + local DB)
- [Domain Glossary](../../CONTEXT.md) — Dashboard definition
