# ADR 0003: Build-time Federation over Runtime Dynamic Federation

**Status:** Superseded by ADR 0004
**Date:** 2026-05-15

## Context

The project started with a runtime Module Federation setup: the shell used `React.lazy(() => import("remote/expose"))` wrapped in `<ClientOnly>` to load remote MFE components. Each MFE was a full TanStack Start application with its own router, API handler, and layout.

This approach had several problems:

1. **No SSR for MFE content** — TanStack Start could not server-render dynamically imported federated modules. All MFE routes showed a loading flash.
2. **SEO impact** — Product pages (critical for e-commerce) were not indexable.
3. **Duplicate API handlers** — Every MFE mounted an identical Elysia API server, creating 4 server instances in dev.
4. **Duplicate QueryClients** — MFE root layouts created isolated TanStack Query clients, causing cache fragmentation.
5. **Dead code** — MFE route trees were never used by the shell; only the exported components were consumed.
6. **Complexity** — `@ts-ignore` on every dynamic import, manual type declarations (`remotes.d.ts`), ClientOnly boilerplate.

## Decision

Use **build-time federation**: the shell imports MFE components directly from workspace packages at build time, while MFEs remain independently deployable build artifacts.

### What stays

- MFEs still use `@module-federation/vite` to produce `remoteEntry.js` and `exposes` at build time
- MFEs are independently versioned and independently built
- MFEs own page-level React components and domain logic

### What changes

- Shell routes import components via runtime federation (ADR 0004) — not build-time imports
- MFEs are stripped of their router, route tree, API handler, layout, and standalone dev server — they are pure component providers
- Shell is the only app with a dev server (`pnpm dev` starts MFEs and shell on ports 3000-3005)

### Independent deployability

Instead of runtime hot-swapping of remote URLs, independent deployment works through the workspace dependency chain:

1. MFE team publishes a new version of a package
2. Shell bumps the dependency
3. Shell rebuilds, picking up the new components

This trades runtime independence for full SSR, simpler code, and elimination of loading states.

---

**Note:** ADR 0004 later replaced build-time federation with runtime Module Federation via `@module-federation/enhanced/runtime`. MFEs are now loaded at runtime through `clientLazy()`, with SSR for shell layout only. See ADR 0004 for the current architecture.

## Consequences

### Positive

- Full SSR for every page — no loading flash, proper SEO
- Single API server (shell only) — no duplication
- Single QueryClient — no cache fragmentation
- No `@ts-ignore`, no `remotes.d.ts`, no `ClientOnly` boilerplate
- One dev server — simpler DX
- MFE package.json files are dramatically simpler

### Negative

- Shell must rebuild to pick up MFE changes (no runtime hot-swap)
- Workspace dependency bumps are needed for MFE version changes
- Slightly larger shell bundle (all deps bundled together)

### Mitigations

- MFE builds still produce isolated artifacts for deployment audit trails
- Turborepo caching means rebuilds are incremental and fast
- If true runtime federation is needed later (plugin system, partner integrations), the MF infrastructure is already in place — just add dynamic imports back

## Alternatives Considered

1. **Full runtime federation** — Kept `React.lazy(dynamic import)`, accepted no SSR. Rejected because SEO and loading flash were unacceptable for an e-commerce site.
2. **MF + Vite SSR attempt** — `@module-federation/vite` with SSR support is insufficiently proven with TanStack Start. Risk of debugging federation internals.
3. **No MF at all** — Eliminate MFEs entirely; shell depends directly on `@repo/commerce/auth/dashboard`. Rejected because MFE build artifacts provide independent versioning and deployment boundaries.

## Related

- `docs/architecture.md` — System architecture
- `CONTEXT.md` — Domain glossary (see MFE, Shell entries)
- ADR 0001: Single Product View Page — References TanStack Router patterns that remain valid
