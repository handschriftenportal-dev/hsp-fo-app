import { createMemoryRouter } from 'react-router'

type CreateMemoryRouterArgs = Parameters<typeof createMemoryRouter>

/**
 * createMemoryRouter with an empty HydrateFallback injected into each
 * top-level route, mirroring the app router (see src/contexts/router.tsx).
 * React Router has no global default for hydrateFallbackElement, so without
 * this every route definition with a loader would emit the dev-only
 * "No HydrateFallback element" warning during initial hydration.
 */
export const createTestRouter = (
  routes: CreateMemoryRouterArgs[0],
  opts?: CreateMemoryRouterArgs[1],
) =>
  createMemoryRouter(
    routes.map((route) => ({ hydrateFallbackElement: <></>, ...route })),
    opts,
  )
