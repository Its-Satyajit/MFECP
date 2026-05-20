# `@repo/shell` — SSR Host

The shell is a TanStack Start application that owns SSR, routing, authentication, API proxying, layout, and hydration. It imports page-level components from MFE packages at build time.

## Architecture

```mermaid
flowchart LR
    Browser["Browser"] --> SSR["TanStack Start SSR"]
    SSR --> Routes["TanStack Router"]
    Routes -->|"/"| P["ProductsPage"]
    Routes -->|"/product/$id"| PD["ProductPage"]
    Routes -->|"/cart"| C["CartPage"]
    Routes -->|"/checkout"| CO["CheckoutPage"]
    Routes -->|"/login"| L["LoginPage"]
    Routes -->|"/register"| R["RegisterPage"]
    Routes -->|"/dashboard"| D["DashboardPage"]
    Routes -->|"/orders"| O["OrdersPage"]
    Routes -->|"/api/*"| E["Elysia API Handler"]
    E --> FSA[("FakeStoreAPI")]
    E --> DB[("Turso DB")]
    subgraph Auth["Auth Guard (_protected)"]
        Session["useQuery(['session'])"]
        Redirect["Redirect to /login"]
    end
    D & O --> Auth
```

## Routes

| Path | Component | Source | Auth |
|---|---|---|---|
| `/` | ProductsPage | `@repo/commerce-mf` | No |
| `/product/$id` | ProductPage | `@repo/commerce-mf` | No |
| `/cart` | CartPage | `@repo/commerce-mf` | No |
| `/checkout` | CheckoutPage | `@repo/commerce-mf` | Yes |
| `/login` | LoginPage | `@repo/auth-mf` | No |
| `/register` | RegisterPage | `@repo/auth-mf` | No |
| `/dashboard` | DashboardPage | `@repo/dashboard-mf` | Yes |
| `/orders` | OrdersPage | `@repo/dashboard-mf` | Yes |
| `/api/$` | Elysia handler | Shell | Varies |

## API

A single Elysia API server (`@repo/api-server`) runs inside `src/routes/api.$.ts`. It proxies FakeStoreAPI endpoints and mounts Better Auth for session management. MFE components call it via Eden Treaty.

## Dev

```bash
pnpm --filter @repo/shell dev    # Local dev on :3000
pnpm dev                          # All apps via turbo
```

## See Also

- [System Architecture](../../docs/architecture.md) — full diagrams and data flows
- [Domain Glossary](../../CONTEXT.md) — canonical definitions
