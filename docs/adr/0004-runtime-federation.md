# ADR 0004: Runtime Module Federation

**Status:** Accepted
**Date:** 2026-05-20

## Context

The project initially used build-time federation (ADR 0003): MFEs imported directly as workspace dependencies. This was chosen for SSR support and simplicity. However, the codebase later migrated to a true runtime federation model using `@module-federation/enhanced/runtime` to enable independent deployability of MFEs. The documentation became stale.

## Decision

Use **runtime Module Federation** as the primary federation strategy:

- **Shell** uses `@module-federation/enhanced/runtime` via `client-lazy.tsx` to load MFE components dynamically at runtime
- **MFEs** produce `remoteEntry.js` via `@module-federation/vite` at build time and expose components
- **Shell** has no `@module-federation/vite` plugin — all consumption is runtime
- **Remote URLs** are configurable via environment variables with localhost dev defaults
- **Auth MFE** is loaded as a runtime remote like all other MFEs (no special build-time import)

### What stays from ADR 0003

- MFEs own page-level React components and domain logic
- MFEs have no router, no API handler, no standalone layout
- Shell owns all routing, SSR, auth, and layout
- MFEs render client-side only (server renders null via `clientLazy`)

### What changes from ADR 0003

| Concern | Build-time (0003) | Runtime (0004) |
|---|---|---|
| MFE loading | `import { X } from "@repo/x"` at build time | `loadMfRemote("x/x")` at runtime |
| SSR for MFE content | Full SSR | Client-only (null on server) |
| Independent deploy | Shell rebuild required | Hot-swap remote URLs |
| Remote URLs | N/A (workspace deps) | Env-configurable |
| Dev servers | Single (port 3000) | Shell + each MFE (3000-3005) |

## Consequences

### Positive

- **True independent deployability** — MFEs can be updated without rebuilding the shell by pointing remote URLs at new builds
- **Consistent MFE model** — all 5 MFEs use the same loading mechanism
- **Env-configurable URLs** — dev, staging, production each have their own remote entry points
- **One less plugin** — shell Vite config is simpler without `@module-federation/vite`

### Negative

- **No SSR for MFE content** — product pages show a loading state on first render
- **More dev servers** — each MFE must be running for full local development
- **Client-side hydration dependency** — MFE content depends on JS loading and executing

### Mitigations

- TanStack Query dehydration provides cached data on initial render even if the component is client-only
- MFEs use `clientLazy` with `<Suspense>` so loading states are handled gracefully
- Turborepo task orchestration starts all MFE dev servers in parallel

## Alternatives Considered

1. **Build-time federation (ADR 0003)** — Keep as-is. Rejected because runtime federation was already implemented and provides better independent deployability.
2. **Hybrid** — Auth as build-time, others as runtime. Rejected because inconsistency creates confusion.

## Related

- `apps/shell/src/remotes/client-lazy.tsx` — Runtime MF orchestration
- `apps/shell/src/remotes/` — Per-MFE remote loaders
- `CONTEXT.md` — Domain glossary (see MFE, Shell entries)
- `docs/architecture.md` — System architecture diagrams
- ADR 0003: Build-time Federation (superseded)
