# `@repo/auth-mf` — Auth Micro-Frontend

Owns authentication domain logic: login, registration, Better Auth client and server instances.

## Exports

| Export | Source |
|---|---|
| `LoginPage` | `src/features/login.tsx` |
| `RegisterPage` | `src/features/register.tsx` |
| `authClient` | `src/lib/auth-client.ts` — browser-side Better Auth client |
| `auth` (server) | `src/lib/auth-instance.ts` — Better Auth server (Drizzle adapter, social providers, email/password) |
| `authRoutes` | `src/remote-routes.tsx` |

## Federation

Exposes `./auth` via `@module-federation/vite`. Produces `remoteEntry.js` at build time. Imported by Shell as `@repo/auth-mf`.

## Dev

```bash
pnpm --filter @repo/auth-mf dev    # Standalone on :3001
```

## See Also

- [Authentication Flow](../../docs/architecture.md#authentication-flow) — full diagram and session management details
- [Domain Glossary](../../CONTEXT.md) — User, Session, Authentication definitions
