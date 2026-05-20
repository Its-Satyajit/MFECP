# `@repo/commerce-mf` — Commerce Micro-Frontend

Owns commerce domain logic: product listing, product detail, cart, checkout.

## Exports

| Export | Source |
|---|---|
| `ProductsPage` | `src/features/products.tsx` |
| `ProductPage` | `src/features/product.tsx` |
| `CartPage` | `src/features/cart.tsx` |
| `CheckoutPage` | `src/features/checkout.tsx` |
| `useCartStore` | `src/lib/cart-store.ts` — Zustand store with localStorage persist |
| `selectTotalItems` | `src/lib/cart-store.ts` |
| `selectTotalPrice` | `src/lib/cart-store.ts` |
| `treatyClient` | `src/lib/api.ts` — Eden Treaty client to Elysia API |
| `commerceRoutes` | `src/remote-routes.tsx` |

## Federation

Exposes `./commerce` via `@module-federation/vite`. Produces `remoteEntry.js` at build time. Imported by Shell as `@repo/commerce-mf`.

## Dev

```bash
pnpm --filter @repo/commerce-mf dev    # Standalone on :3003
```

## See Also

- [Checkout Flow](../../docs/architecture.md#checkout-flow) — full diagram (cart → auth → form → order → confirmation)
- [Data Flow](../../docs/architecture.md#data-flow-and-query-pattern) — Eden Treaty → Elysia → FakeStoreAPI with LRU cache
- [Cart State Management](../../docs/architecture.md#cart-state-management) — Zustand + localStorage diagram
- [Domain Glossary](../../CONTEXT.md) — Product, Cart, CartItem, Add to Bag definitions
