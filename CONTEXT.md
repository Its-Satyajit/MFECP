# Context for Micro-Frontend-E-Commerce-Platform

## Product

An item available for purchase in the e-commerce store. Products have the following attributes:

- id: Unique identifier (string, from jsoning.com)
- name: Product name (string)
- price: Cost in USD (number)
- description: Detailed product information (string)
- category: Product classification (string)
- stock: Available inventory count (number)
- sku: Stock keeping unit (string)
- image_url: URL to product image (string)
- rating: Product rating information (object) containing:
  - rate: Average rating value (number)
  - count: Number of ratings (integer)

Product data is retrieved from the jsoning.com API at `https://api.jsoning.com/mock/public/products/{id}` via an Elysia proxy at `/api/products/{id}`

## Cart

A transient collection of products a customer intends to purchase. The cart is stored client-side (localStorage) via a shared Zustand store (`@repo/cart-store`) and is not persisted to any server. Each entry in the cart is a CartItem.

## CartItem

A single line within the Cart representing one product and a chosen quantity. CartItem attributes:

- id: Product identifier (number, matches Product.id parsed to number)
- title: Product name (string, maps from Product.name)
- price: Unit price in USD (number, matches Product.price)
- image: Product image URL (string, maps from Product.image_url)
- quantity: Number of units desired (positive integer)

## Add to Bag

The action of adding a Product to the Cart as a CartItem with quantity 1. If the product is already in the Cart, its quantity is incremented by 1 instead of creating a duplicate entry. If the User is not authenticated, they are redirected to login first.

## Checkout

The process of completing a purchase from the Cart. Requires a User to be authenticated. The User reviews their Order, provides shipping information, and confirms the purchase. On confirmation, the Cart is cleared and an Order is persisted and displayed. No real payment is processed — this is a simulated flow.

## Customer

A person who browses products and maintains a Cart. Does not require authentication.
_Avoid_: User, visitor, buyer

## User

A Customer who has registered an account and can authenticate. Users have a name, email, and optional profile image stored in the system.
_Avoid_: Account, member

## Dashboard

A metrics and analytics hub visible to authenticated Users. Displays product statistics, revenue snapshots, top-rated products, category breakdowns, recent products, and recent account registrations. Data is aggregated from the jsoning.com API proxy and the local database.

## Micro Frontend (MFE)

An independently deployable build artifact that exposes page-level React components via Module Federation at runtime. MFEs own business logic and UI for a domain. They have no router, no API handler, no standalone layout, and no SSR — the Shell owns all of those. The Shell loads MFE components as runtime remotes via `@module-federation/enhanced/runtime` — not imported at build time. Each MFE runs on its own port in development (3001–3005) and exposes components via `remoteEntry.js`. The Shell hydrates MFE components client-side only.
_Avoid_: Remote app, sub-app, microservice frontend

## Shell

The host application that owns SSR, routing, authentication sessions, API proxying, layout, and hydration. Loads MFE components as runtime Module Federation remotes via `@module-federation/enhanced/runtime`. Renders layout server-side; MFE components load client-side via `clientLazy()`. All auth guards are centralized in TanStack Router `beforeLoad`.
_Avoid_: Host app, container

## Auth App

The MFE responsible for User Authentication. Exposes `LoginPage` and `RegisterPage` components. Uses Better Auth for authentication with email/password and social providers (GitHub, Google, Facebook). Runs on port 3001.

## Dashboard MFE

The MFE responsible for analytics. Exposes `DashboardPage` (metrics, revenue snapshots, top-rated products, category breakdowns). Protected — requires authentication. Runs on port 3005.

## Product App

The MFE responsible for Product browsing. Exposes `ProductsPage` (catalog listing with search and category filter) and `ProductPage` (detail view with Add to Bag). Runs on port 3002.

## Cart App

The MFE responsible for Cart and Checkout. Exposes `CartPage` (items list with quantity controls) and `CheckoutPage` (shipping form, order summary, place order). Runs on port 3003.

## Order App

The MFE responsible for Order history. Exposes `OrdersPage` (list of past orders with items). Protected — requires authentication. Runs on port 3004.

## Authentication

The process of verifying a User's identity via email/password or a social provider (GitHub, Google, Facebook). Successful authentication creates a Session. Auth gate is at Add to Bag and Checkout.

## Session

A User's active authenticated login. Managed server-side via secure cookies (Better Auth).

## Order

A completed purchase persisted in the database. Created during Checkout — the Cart items are converted into an Order with shipping information, and the Cart is cleared. Orders are owned by a User and visible on the Orders page.
_Avoid_: Purchase, transaction

## OrderItem

A single line within an Order representing one Product and its quantity at the time of purchase. This is a snapshot — it preserves the product title, price, and image regardless of future changes to the Product catalog.
