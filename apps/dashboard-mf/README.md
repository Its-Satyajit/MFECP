# `@repo/dashboard-mf` — Dashboard Micro-Frontend

Owns dashboard and orders domain logic: analytics hub, order history.

## Exports

| Export | Source |
|---|---|
| `DashboardPage` | `src/features/dashboard.tsx` |
| `OrdersPage` | `src/features/orders.tsx` |
| `dashboardRoutes` | `src/remote-routes.tsx` |

## Federation

Exposes `./dashboard` via `@module-federation/vite`. Produces `remoteEntry.js` at build time. Imported by Shell as `@repo/dashboard-mf`.

## Dev

```bash
pnpm --filter @repo/dashboard-mf dev    # Standalone on :3002
```

## See Also

- [Dashboard Aggregation Flow](../../docs/architecture.md#dashboard-aggregation-flow) — full diagram (FakeStoreAPI stats + local DB)
- [Domain Glossary](../../CONTEXT.md) — Dashboard, Order, OrderItem definitions
