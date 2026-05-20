# ADR 0002: TanStack Form for Form Management

**Status:** Accepted
**Date:** 2026-05-15

## Context

The checkout form requires validation (required fields, email format). We needed to choose a form management library.

## Decision

Use `@tanstack/react-form` instead of `react-hook-form` (the shadcn/ui standard).

## Consequences

- **Pro:** Consistent with the existing TanStack ecosystem (Router, Query, Start)
- **Pro:** No additional paradigm shifts for the team
- **Con:** Cannot use shadcn's `Form` component (designed for react-hook-form)
- **Con:** Manual field rendering with `form.Field` render props instead of shadcn's declarative form pattern
- **Mitigation:** Use `Input` + `Label` from `@repo/ui` directly with TanStack Form's field API

## Alternatives Considered

1. **react-hook-form + @hookform/resolvers + zod** — shadcn standard, but adds a new paradigm
2. **Manual state + HTML5 validation** — simpler but no custom validation UX
