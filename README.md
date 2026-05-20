# Micro-Frontend E-Commerce Platform

A micro-frontend e-commerce platform built with TanStack Start, Module Federation, and Turborepo. Three independently built MFEs compose into a single SSR-hosted application.

## System Architecture

```mermaid
flowchart TB
    Browser["🌐 Browser"]

    subgraph Shell["Shell (SSR Host · port 3000)"]
        Router["TanStack Router"]
        Layout["Root Layout"]
        SSR["SSR + Hydration"]
        API["Elysia API Handler<br/>(/api/$)"]
    end

    subgraph AuthMF["@repo/auth-mf"]
        Login["LoginPage"]
        Register["RegisterPage"]
        BAuth["Better Auth"]
    end

    subgraph CommerceMF["@repo/commerce-mf"]
        Products["ProductsPage"]
        Product["ProductPage"]
        Cart["CartPage"]
        Checkout["CheckoutPage"]
        ZStore["Zustand Cart Store"]
    end

    subgraph DashboardMF["@repo/dashboard-mf"]
        Dashboard["DashboardPage"]
        Orders["OrdersPage"]
    end

    subgraph Shared["Shared Packages"]
        UI["@repo/ui"]
        Types["@repo/types"]
        DBpkg["@repo/db"]
        ApiSrv["@repo/api-server"]
    end

    FSA[("FakeStoreAPI")]
    TDB[("Turso DB")]

    Browser --> Shell
    Layout --> AuthMF & CommerceMF & DashboardMF
    SSR & API --> ApiSrv
    ApiSrv -->|product / cart / user proxy| FSA
    ApiSrv -->|orders + auth| TDB
    ZStore -->|persist| LS[("localStorage")]
    CommerceMF --> AuthMF
    CommerceMF & DashboardMF --> API
```

**Pattern**: [Build-time Federation](docs/architecture.md#build-time-federation-flow) — Shell imports MFE components at build time. Full SSR for all pages.

## Quick Start

```bash
pnpm install
pnpm dev              # Starts shell on :3000
pnpm build            # Builds all packages + MFEs + shell
pnpm typecheck        # TypeScript check all packages
```

## Project Structure

```
apps/
├── shell/                  SSR host (port 3000)
├── auth-mf/                Auth domain (login, register)
├── commerce-mf/            Commerce domain (products, cart, checkout)
└── dashboard-mf/           Dashboard domain (dashboard, orders)
packages/
├── ui/                     Shared UI components (ShadCN-style)
├── db/                     Drizzle ORM + libSQL/Turso
├── api-server/             Elysia API server
├── types/                  Shared TypeScript interfaces
├── env/                    T3 Env schemas
├── query/                  Shared TanStack Query client
└── utils/                  Shared utilities
```

## Documentation

| Document | Description |
|---|---|
| [Architecture](docs/architecture.md) | Diagrams, data flows, SSR lifecycle, auth flow, checkout flow — with Mermaid |
| [Domain Glossary](CONTEXT.md) | Product, Cart, User, Order, MFE, Shell — canonical definitions |
| [ADRs](docs/adr/) | Architecture Decision Records (build-time federation, TanStack Form, etc.) |

## Core Flows

| Flow | Description |
|---|---|
| [SSR Request Lifecycle](docs/architecture.md#ssr-request-lifecycle) | Browser → TanStack Router → prefetch → render → hydrate |
| [Authentication](docs/architecture.md#authentication-flow) | Email/password or social (GitHub, Google, Facebook) via Better Auth |
| [Checkout](docs/architecture.md#checkout-flow) | Cart → auth gate → shipping form → Elysia POST → Drizzle insert → confirmation |
| [Data Fetching](docs/architecture.md#data-flow-and-query-pattern) | MFE → Eden Treaty → Elysia → FakeStoreAPI (LRU cached) or Turso |
| [Cart State](docs/architecture.md#cart-state-management) | Zustand + localStorage persist, no server-side cart |
| [Dashboard Aggregation](docs/architecture.md#dashboard-aggregation-flow) | Combines FakeStoreAPI stats + local DB orders + users |

## Tech Stack

| Concern | Choice |
|---|---|
| Monorepo | Turborepo + pnpm |
| Framework | TanStack Start (SSR) |
| Build | Vite 8 + Rolldown |
| Router | TanStack Router |
| Query | TanStack Query |
| Forms | TanStack Form |
| Auth | Better Auth |
| Database | Drizzle + libSQL/Turso |
| API | Elysia (Eden Treaty client) |
| UI | Tailwind CSS v4 + ShadCN-style (Radix) |
| Federation | `@module-federation/vite` |
| Client State | Zustand (localStorage) |

## Project Status

Work in progress.
