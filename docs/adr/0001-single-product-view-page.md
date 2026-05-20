# ADR 0001: Single Product View Page Implementation

## Status

Accepted

## Context

We needed to implement a single product view page that displays detailed information for a specific product retrieved from the FakeStoreAPI. The page should be accessible via a route like `/products/:id` and show extended product information including specifications, reviews, and related products.

## Decision

We implemented the ProductPage component in the commerce package (`@repo/commerce`) with the following characteristics:

1. **Data Fetching**: Used TanStack Query's `useQuery` hook to fetch product data from `https://fakestoreapi.com/products/{id}` where the ID comes from route parameters
2. **Route Parameter Access**: Used TanStack Router's `useParams` hook to extract the product ID from the URL
3. **UI Components**: Utilized existing UI components from `@repo/ui` where possible, with custom styling for product-specific layout
4. **Navigation**: Added navigation links from the ProductsPage to ProductPage using TanStack Router's `Link` component
5. **Error Handling**: Implemented proper loading, error, and empty states
6. **Extended Information**: Displayed product specifications (category, price, description), customer reviews (rating), and included a placeholder for related products

## Location Choice

We placed the component in `@repo/commerce/src/features/product.tsx` because:

- The commerce package already contains related product functionality (ProductsPage)
- Keeping product-related features in the same package maintains cohesion
- The component is specific to the commerce domain

## Data Fetching Approach

We chose `useQuery` with route parameters because:

- It provides automatic caching and deduplication
- It handles loading and error states elegantly
- It integrates well with TanStack Router's parameter handling
- It follows existing patterns in the codebase (seen in ProductsPage and DashboardPage)

## Component Structure

The component follows a responsive layout:

- Image gallery on left (full width on mobile, reduced width on desktop)
- Product details (title, price, description, rating) on right
- Related products section at the bottom
- Responsive grid that adapts to different screen sizes

## Consequences

### Positive

- Consistent with existing data fetching patterns in the codebase
- Proper separation of concerns (data fetching vs presentation)
- Reusable and maintainable component
- Good user experience with loading states and error handling
- Follows accessibility best practices (semantic HTML, proper contrast)

### Negative

- Slightly more complex than a simple static component
- Requires understanding of TanStack Query and TanStack Router

## Related Decisions

- `/products` is a layout route (renders `<Outlet />`) with two children: an index route (`/products/`) for the product list (`ProductsPage`) and a `$id` route (`/products/$id`) for the product detail (`ProductPage`)
- Relies on the `@repo/ui` component library for basic UI elements
- Uses the same Product interface definition as other parts of the application

## References

- [FakeStoreAPI Documentation](https://fakestoreapi.com/docs)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [TanStack Router Documentation](https://tanstack.com/router/latest)
