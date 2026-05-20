# Architecture

## System Architecture

```mermaid
flowchart TB
    Browser["🌐 Browser"]

    subgraph Shell["Shell — @repo/shell (TanStack Start SSR, port 3000)"]
        Router["TanStack Router"]
        Layout["Root Layout<br/>Nav, Auth Check, Cart Badge"]
        SSR["SSR Engine"]
        QClient["TanStack Query Client"]
        API["Elysia API Handler<br/>apps/shell/src/routes/api.$.ts"]
    end

    subgraph MFEs["Micro Frontends (Build Artifacts)"]
        AuthMF["@repo/auth-mf<br/>Login, Register<br/>Better Auth client + server"]
        CommerceMF["@repo/commerce-mf<br/>Products, Product, Cart, Checkout<br/>Zustand cart store"]
        DashboardMF["@repo/dashboard-mf<br/>Dashboard, Orders"]
    end

    subgraph Packages["Shared Packages"]
        UI["@repo/ui<br/>ShadCN-style components"]
        Types["@repo/types<br/>Product, User, Order interfaces"]
        DB["@repo/db<br/>Drizzle ORM + libSQL/Turso"]
        ApiServer["@repo/api-server<br/>Elysia app instance"]
        Query["@repo/query<br/>TanStack Query config"]
    end

    subgraph External["External"]
        FSA[("FakeStoreAPI<br/>fakestoreapi.com")]
        Turso[("Turso / SQLite DB<br/>users, sessions, orders")]
    end

    Browser --> Shell
    Layout --> AuthMF & CommerceMF & DashboardMF
    Router --> SSR
    SSR --> QClient
    SSR --> API

    CommerceMF --> API
    DashboardMF --> API
    AuthMF --> API

    API -->|proxy /products, /carts, /users| FSA
    API -->|CRUD orders, auth| Turso

    Shell --> Packages
```

## Build-time Federation Flow

```mermaid
flowchart LR
    subgraph Build["Build Process"]
        direction TB
        MFE_SRC["MFE Source Code<br/>apps/auth-mf/src/*"] --> Vite["Vite 8 +<br/>@module-federation/vite"]
        Vite --> RemoteEntry["remoteEntry.js<br/>+ chunk files<br/>→ apps/auth-mf/dist/"]

        SHELL_SRC["Shell Source Code<br/>apps/shell/src/*"] --> SVite["Vite 8 +<br/>@tanstack/react-start/plugin"]
        RemoteEntry --> SVite
        SVite --> Bundle["Single Deployable Bundle<br/>apps/shell/dist/"]
    end

    subgraph Deploy["Deploy"]
        Bundle --> Server["Production Server<br/>(Node via Nitro)"]
    end

    subgraph Runtime["Runtime"]
        Server --> HTML["SSR HTML"]
        Server --> Hydrate["Client Hydration"]
    end
```

The Shell imports MFE components directly via workspace dependencies at build time:

| Shell import | Resolves to |
|---|---|
| `import { LoginPage } from "@repo/auth-mf"` | `apps/auth-mf/src/export.ts` |
| `import { ProductsPage } from "@repo/commerce-mf"` | `apps/commerce-mf/src/export.ts` |
| `import { DashboardPage } from "@repo/dashboard-mf"` | `apps/dashboard-mf/src/export.ts` |

No runtime dynamic `import()`. The shell must rebuild to pick up new MFE versions.

## SSR Request Lifecycle

```mermaid
sequenceDiagram
    participant Browser as Browser
    participant Router as TanStack Router
    participant SSR as SSR Engine
    participant Cache as React Query Cache
    participant Treaty as Eden Treaty
    participant Elysia as Elysia API
    participant Ext as External Source

    Browser->>Router: GET /product/42
    Router->>SSR: Match route /product/$id
    SSR->>SSR: Render React tree (Shell Layout + MFE components)
    SSR->>Cache: Prefetch all useQuery calls
    Cache->>Treaty: treatyClient.api.products({id: 42}).get()
    Treaty->>Elysia: GET /api/products/42
    Elysia->>Ext: fetch external API / cache lookup
    Ext-->>Elysia: Product data
    Elysia-->>Treaty: Typed JSON response
    Treaty-->>Cache: Cached + serialized
    Cache-->>SSR: Data ready
    SSR-->>Browser: Full HTML + dehydrated state (script)
    Browser->>Browser: Hydrate (React + TanStack Query)
    Browser->>Cache: Restore dehydrated cache
    Note over Browser,Cache: Client takes over — MFE components become interactive
```

### SSR Lifecycle Steps

1. **Request arrives** → TanStack Start server (Nitro) receives the request
2. **Route matching** → TanStack Router matches the URL path against the route tree
3. **Data prefetching** → The SSR engine collects all `useQuery` calls in the rendered component tree and prefetches them server-side
4. **Component rendering** → React renders the full tree: Shell Layout (nav, auth check) → page component from MFE (e.g. `ProductPage`)
5. **API calls** → MFE components call Elysia through Eden Treaty. The Elysia API runs inside the Shell's `api.$.ts` catch-all route — same process, no network hop
6. **HTML streaming** → Rendered HTML streams to the browser with a `<script>` tag containing dehydrated TanStack Query state
7. **Hydration** → React hydrates on the client. TanStack Query restores the server-fetched cache, skipping redundant re-fetches

## Authentication Flow

```mermaid
flowchart TD
    subgraph Forms["Login Forms"]
        EP["Email/Password<br/>authClient.signIn.email()"]
        Social["Social Providers<br/>GitHub · Google · Facebook<br/>authClient.signIn.social()"]
    end

    subgraph Auth["Better Auth (Server)"]
        Verify["Verify credentials"]
        Session["Create Session"]
        Cookie["Set secure cookie"]
    end

    subgraph Routes["Route Protection"]
        Public["Public Routes<br/>/, /product/$id, /cart"]
        Guard["_Protected Layout<br/>apps/shell/src/routes/_protected.tsx"]
        Check["useQuery(['session'])<br/>getSession() → /api/session"]
        LoginRedirect["Redirect to /login<br/>?redirect=current_path"]
    end

    subgraph Server["Server-side (SSR)"]
        SSRSession["getSession(request)<br/>apps/shell/src/lib/session.ts"]
        SSRRedirect["Redirect or render"]
    end

    Browser["Browser Request"] --> Public
    Browser --> Guard

    Guard --> Check
    Check -->|"session exists"| Render["Render protected component"]
    Check -->|"no session"| LoginRedirect
    LoginRedirect --> Forms

    Forms -->|"POST /api/auth/*"| Auth
    Auth --> Cookie

    Browser2["SSR Request to protected route"] --> SSRSession
    SSRSession -->|"read cookie header"| Auth
    Auth -->|"valid session"| SSRRedirect
    Auth -->|"invalid/expired"| SSRRedirect

    Public --> Render2["Render public component"]

    Cookie -.->|"sent with every request"| Check
    Cookie -.->|"sent with SSR"| SSRSession
```

### Auth Implementation Details

- **Server instance**: Better Auth configured with Drizzle adapter (SQLite) in `apps/auth-mf/src/lib/auth-instance.ts`. Supports email/password + GitHub, Google, Facebook OAuth.
- **Client instance**: `createAuthClient()` in `apps/auth-mf/src/lib/auth-client.ts`. Used by LoginPage and RegisterPage.
- **Session fetch**: `getSession()` in `apps/shell/src/lib/session.ts` calls `GET /api/session` (handled by Elysia in `packages/api-server/index.ts`) and forwards the cookie from the request.
- **Route guard**: `apps/shell/src/routes/_protected.tsx` wraps `/dashboard` and `/orders`. Uses `useQuery` with `getSession()`. Redirects to `/login?redirect=...` if unauthenticated.
- **Root layout**: `apps/shell/src/routes/__root.tsx` always fetches the session to show login/logout state and the cart badge in the nav bar.

## Checkout Flow

```mermaid
flowchart TD
    Cart["CartPage<br/>apps/commerce-mf/src/features/cart.tsx"] -->|"Click Checkout"| Navigate["Navigate to /checkout"]

    Navigate --> Empty{"Cart Empty?"}

    Empty -->|"Yes"| EmptyState["Show Empty State<br/>Link back to /"]
    Empty -->|"No"| Checkout["CheckoutPage<br/>apps/commerce-mf/src/features/checkout.tsx"]

    Checkout --> AuthGate{"Authenticated?"}
    AuthGate -->|"No — SSR redirect"| Login["/login<br/>?redirect=/checkout"]
    AuthGate -->|"Yes"| Form["Shipping Form<br/>TanStack Form<br/>name, email, address, city, zip"]

    Form --> Validate{"Valid?"}
    Validate -->|"No"| FormErrors["Show Field Errors"]
    Validate -->|"Yes"| Submit["Submit Order"]

    Submit --> API["POST /api/orders<br/>Elysia Route<br/>packages/api-server/src/routes/orders.ts"]
    API --> AuthCheck{"Valid Session?"}
    AuthCheck -->|"No"| Error["401 Unauthorized"]
    AuthCheck -->|"Yes"| Insert["Drizzle Transaction<br/>INSERT INTO order<br/>INSERT INTO order_item × N"]

    Insert --> Success["Return { orderId }"]
    Success --> Client["Client receives orderId"]
    Client --> ClearCart["useCartStore.clearCart()"]
    ClearCart --> Confirm["Confirmation Screen<br/>Order ID displayed"]

    Confirm --> Continue["Continue Shopping → /"]
```

### Checkout Data Flow

```
CartItem[] (Zustand, localStorage)
  → JSON payload with shipping details
  → POST /api/orders (Elysia verifies session)
  → Drizzle INSERT Order + OrderItem[] (snapshot — preserves title, price, image)
  → Returns orderId (UUID v4)
  → Client clears Zustand cart → shows confirmation
```

## Data Flow and Query Pattern

```mermaid
sequenceDiagram
    participant Component as MFE Component
    participant Q as TanStack Query
    participant Treaty as Eden Treaty Client
    participant Elysia as Elysia API
    participant Cache as LRU Cache<br/>(500 items, 5min TTL)
    participant Source as Data Source

    Component->>Q: useQuery(["products"], fetcher)
    Component->>Q: useQuery(["product", id], fetcher)
    Component->>Q: useQuery(["orders"], fetcher)

    Q->>Treaty: treatyClient.api.products.get()
    Treaty->>Elysia: GET /api/products

    Elysia->>Cache: cache.get("/api/products")
    alt Cache Hit
        Cache-->>Elysia: Return cached
    else Cache Miss
        Elysia->>Source: fetch(FakeStoreAPI + LRU cache)
        Source-->>Elysia: Response
        Elysia->>Cache: cache.set(key, data, 300s)
    end
    Elysia-->>Treaty: JSON Response
    Treaty-->>Q: Typed data
    Q-->>Component: Product[]

    Note over Q: staleTime: 5min (configurable)
    Note over Treaty: credentials: "include"<br/>(sends auth cookies)
```

### Cart State Management

```mermaid
flowchart LR
    Add["ProductPage<br/>Add to Bag"] -->|"addItem(product)"| Store["Zustand Store<br/>useCartStore"]
    Update["CartPage<br/>+ / - / Remove"] -->|"updateQuantity(id, qty)<br/>removeItem(id)"| Store
    Checkout["CheckoutPage<br/>Order Submitted"] -->|"clearCart()"| Store

    Store -->|"persist middleware"| LS[("localStorage<br/>key: micro-frontend-ecommerce-platform-cart")]

    Store -->|"selectTotalItems"| Badge["Shell Nav<br/>Cart Badge<br/>(useCartStore)"]
    Store -->|"items + totals"| CartPage
    Store -->|"items"| Checkout
```

The cart is **purely client-side** — Zustand with the `persist` middleware keeps it in `localStorage`. No server-side cart. On checkout, cart items are snapshot into OrderItems and the cart is cleared.

## Cart Data Flow

```mermaid
flowchart LR
    subgraph Local["Client Side"]
        Zustand["useCartStore (Zustand)"]
        LS[("localStorage")]
    end
    subgraph Server["Server Side"]
        API["POST /api/orders"]
        Drizzle["Drizzle ORM"]
        DB[("libSQL / Turso")]
    end

    Product["Product"] -->|"addItem"| Zustand
    Zustand <-->|"persist / rehydrate"| LS
    Zustand -->|"selectTotalItems"| Nav["Shell Nav"]
    Zustand -->|"selectTotalPrice"| Cart["CartPage"]
    Cart -->|"Checkout"| Checkout["CheckoutPage"]
    Checkout -->|"Order payload"| API
    API -->|"INSERT order + orderItems"| Drizzle
    Drizzle -->|"SQL"| DB
    API -->|"orderId"| Checkout
    Checkout -->|"clearCart()"| Zustand
```

## Dashboard Aggregation Flow

```mermaid
flowchart TD
    Dash["DashboardPage<br/>apps/dashboard-mf/src/features/dashboard.tsx"] -->|"useQuery"| Treaty["treatyClient"]
    Treaty -->|"GET /api/dashboard/metrics"| Elysia["Elysia Route<br/>packages/api-server/src/routes/dashboard.ts"]

    Elysia -->|"fetch()"| FSA[("FakeStoreAPI")]
    Elysia -->|"Drizzle select()"| LocalDB[("Turso DB")]

    FSA -->|"/products"| Products["Product Catalog Stats<br/>total, categories, avgPrice<br/>avgRating, min/maxPrice"]
    FSA -->|"/carts"| Carts["Cart Stats<br/>totalCarts, avgItems/cart"]
    FSA -->|"/users"| Users["FakeStore User Count"]
    LocalDB -->|"ORDER BY createdAt DESC<br/>LIMIT 5"| RecentUsers["Recent Auth Users"]
    LocalDB -->|"SELECT * FROM orders"| Orders["Revenue Metrics<br/>totalOrders, totalRevenue<br/>avgOrderValue"]

    Products --> Aggregate["Aggregate & Return"]
    Carts --> Aggregate
    Users --> Aggregate
    RecentUsers --> Aggregate
    Orders --> Aggregate

    Aggregate -->|"JSON"| Dash
```

## Technology Stack

| Concern | Technology |
|---|---|
| Monorepo | Turborepo ^2.9 + pnpm ^10.33 |
| Framework | TanStack Start (SSR, via Nitro) |
| Build | Vite ^8.0 + Rolldown |
| Router | TanStack Router (file-based, codegen) |
| Query | TanStack Query (SSR integration) |
| Forms | TanStack Form ^1.32 |
| UI | ShadCN-style (Radix UI + CVA + Tailwind v4) |
| CSS | Tailwind CSS v4 + tw-animate-css |
| Icons | Lucide React + Simple Icons |
| Auth | Better Auth ^1.6 (email/password + GitHub, Google, Facebook) |
| Database | Drizzle ORM ^0.45 + libSQL (SQLite/Turso) |
| API Server | Elysia (type-safe, Eden Treaty client) |
| Client State | Zustand ^5.13 (localStorage persist) |
| Search | FlexSearch ^0.8 (client-side full-text) |
| Caching | lru-cache ^11.3 (500 items, 5min TTL) |
| Language | TypeScript ^6.0 |
| Linting | Biome 2.4 |
| Testing | Vitest ^4.1 + Testing Library |
| Federation | @module-federation/vite ^1.15 |
| Runtime | Nitro nightly 3.0 |

## Route Map

| Path | Component | Source | Auth Required |
|---|---|---|---|
| `/` | ProductsPage | `@repo/commerce-mf` | No |
| `/product/$id` | ProductPage | `@repo/commerce-mf` | No |
| `/cart` | CartPage | `@repo/commerce-mf` | No |
| `/checkout` | CheckoutPage | `@repo/commerce-mf` | Yes |
| `/login` | LoginPage | `@repo/auth-mf` | No (redirect if authed) |
| `/register` | RegisterPage | `@repo/auth-mf` | No (redirect if authed) |
| `/dashboard` | DashboardPage | `@repo/dashboard-mf` | Yes |
| `/orders` | OrdersPage | `@repo/dashboard-mf` | Yes |
| `/api/$` | Elysia handler | Shell | Varies |

## Project Structure

```
Micro-Frontend-E-Commerce-Platform/
├── apps/
│   ├── shell/              # @repo/shell       SSR host (port 3000)
│   ├── auth-mf/            # @repo/auth-mf     Auth MFE build artifact
│   ├── commerce-mf/        # @repo/commerce-mf  Commerce MFE build artifact
│   └── dashboard-mf/       # @repo/dashboard-mf Dashboard MFE build artifact
├── packages/
│   ├── api-server/         # @repo/api-server   Elysia API app instance
│   ├── db/                 # @repo/db           Drizzle + libSQL/Turso
│   ├── env/                # @repo/env          T3 Env + Zod schemas
│   ├── query/              # @repo/query        Shared TanStack Query client
│   ├── types/              # @repo/types        Shared TypeScript interfaces
│   ├── ui/                 # @repo/ui           ShadCN-style UI components
│   └── utils/              # @repo/utils        Shared utilities
├── docs/
│   ├── adr/                # Architecture Decision Records
│   └── architecture.md     # This file
├── CONTEXT.md              # Domain glossary
├── pnpm-workspace.yaml     # Workspace config (apps/*, packages/*)
└── turbo.json              # Turborepo task orchestration
```

## Run Commands

```bash
pnpm install              # Install dependencies
pnpm dev                  # Start shell on port 3000
pnpm build                # Build all packages + MFEs + shell
pnpm typecheck            # TypeScript check all packages
pnpm test                 # Run tests
pnpm lint                 # Biome lint all packages
```
