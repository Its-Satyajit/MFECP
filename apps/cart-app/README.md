# `@repo/cart-app` — Cart Micro-Frontend

Owns cart and checkout domain: cart management with quantity controls, and order submission with shipping form.

## Exports

| Export | Source |
|---|---|
| `CartPage` | `src/features/cart.tsx` |
| `CheckoutPage` | `src/features/checkout.tsx` |
| `cartRoutes` | `src/remote-routes.tsx` |

## Federation

Exposes `./cart` via `@module-federation/vite`. Produces `remoteEntry.js` at build time. Loaded by Shell as a runtime remote.

## Features

- **Client-side cart** — Zustand store persisted to localStorage (`@repo/cart-store`)
- **Quantity controls** — Increment, decrement, and remove items
- **Checkout flow** — Shipping form (TanStack Form), validation, order submission
- **Auth gate** — Shell redirects unauthenticated users before checkout
- **Dirty-form warning** — `beforeunload` if form has unsaved changes

## Dev

```bash
pnpm --filter @repo/cart-app dev    # Standalone on :3003
```

## See Also

- [Cart State Management](../../docs/architecture.md#cart-state-management) — Zustand + localStorage flow
- [Checkout Flow](../../docs/architecture.md#checkout-flow) — end-to-end order submission
- [Domain Glossary](../../CONTEXT.md) — Cart, CartItem, Checkout definitions
