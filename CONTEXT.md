# Context for Micro-Frontend-E-Commerce-Platform

## Product

An item available for purchase in the e-commerce store. Products have the following attributes:

- id: Unique identifier (integer)
- title: Product name (string)
- price: Cost in USD (number)
- description: Detailed product information (string)
- category: Product classification (string)
- image: URL to product image (string)
- rating: Product rating information (object) containing:
  - rate: Average rating value (number)
  - count: Number of ratings (integer)

Product data is retrieved from the FakeStoreAPI at <https://fakestoreapi.com/products/{id}> via an Elysia proxy at `/api/products/{id}`

## Cart

A transient collection of products a customer intends to purchase. The cart is stored client-side (localStorage) and is not persisted to any server. Each entry in the cart is a CartItem.

## CartItem

A single line within the Cart representing one product and a chosen quantity. CartItem attributes:

- id: Product identifier (integer, matches Product.id)
- title: Product name (string, matches Product.title)
- price: Unit price in USD (number, matches Product.price)
- image: Product image URL (string, matches Product.image)
- quantity: Number of units desired (positive integer)

## Add to Bag

The action of adding a Product to the Cart as a CartItem with quantity 1. If the product is already in the Cart, its quantity is incremented by 1 instead of creating a duplicate entry.

## Checkout

The process of completing a purchase from the Cart. Requires a User to be authenticated. The User reviews their Order, provides shipping information, and confirms the purchase. On confirmation, the Cart is cleared and an Order is persisted and displayed. No real payment is processed — this is a simulated flow.

## Customer

A person who browses products and maintains a Cart. Does not require authentication.
_Avoid_: User, visitor, buyer

## User

A Customer who has registered an account and can authenticate. Users have a name, email, and optional profile image stored in the system.
_Avoid_: Account, member

## Dashboard

A metrics and analytics hub visible to authenticated Users. Displays product statistics, revenue snapshots, top-rated products, category breakdowns, recent products, and recent account registrations. Data is aggregated from the FakeStoreAPI proxy and the local database.

## Micro Frontend (MFE)

An independently deployable build artifact that exposes page-level React components. MFEs own business logic and UI for a domain. They have no router, no API handler, no standalone layout, and no SSR — the Shell owns all of those. The Shell imports MFE components directly from MFE packages at build time. MFEs are independently versioned and independently built, but the Shell must rebuild to pick up new MFE versions. Each MFE contains its own source code (features, lib, state) — the domain packages (`@repo/auth`, `@repo/commerce`, `@repo/dashboard`) do not exist; their code lives inside the MFE.

_Avoid_: Remote app, sub-app, microservice frontend

## Shell

The host application that owns SSR, routing, authentication sessions, API proxying, layout, and hydration. Imports components directly from MFE packages (`@repo/auth-mf`, `@repo/commerce-mf`, `@repo/dashboard-mf`) at build time. Renders all content server-side.
_Avoid_: Host app, container

## Authentication

The process of verifying a User's identity via email/password or a social provider (GitHub, Google, Facebook). Successful authentication creates a Session.

## Session

A User's active authenticated login. Managed server-side via secure cookies.

## Order

A completed purchase persisted in the database. Created during Checkout — the Cart items are converted into an Order with shipping information, and the Cart is cleared. Orders are owned by a User and visible on the Orders page.
_Avoid_: Purchase, transaction

## OrderItem

A single line within an Order representing one Product and its quantity at the time of purchase. This is a snapshot — it preserves the product title, price, and image regardless of future changes to the Product catalog.
