# `@repo/order-app` — Order Micro-Frontend

Owns order history domain: read-only listing of past orders with their line items.

## Exports

| Export | Source |
|---|---|
| `OrdersPage` | `src/features/orders.tsx` |
| `orderRoutes` | `src/remote-routes.tsx` |

## Federation

Exposes `./order` via `@module-federation/vite`. Produces `remoteEntry.js` at build time. Loaded by Shell as a runtime remote.

## Features

- **Order history** — Lists past orders with date, total, and line items
- **Snapshot data** — Preserves title, price, and image at time of purchase
- **Protected** — Requires authentication (Shell enforces via `beforeLoad` guard)

## Dev

```bash
pnpm --filter @repo/order-app dev    # Standalone on :3004
```

## See Also

- [Authentication Flow](../../docs/architecture.md#authentication-flow) — route guard details
- [Domain Glossary](../../CONTEXT.md) — Order, OrderItem definitions
