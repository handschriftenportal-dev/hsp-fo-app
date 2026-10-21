import { act, waitFor } from '@testing-library/react'
import { createMemoryRouter } from 'react-router'

type DataRouter = ReturnType<typeof createMemoryRouter>

/**
 * Waits until a data router has finished its initial hydration and the
 * resulting UI is committed. React Router v7 renders only the empty
 * HydrateFallback until loaders settle and wraps router state updates in
 * startTransition, so a plain render returns before the loader-driven UI
 * exists.
 */
export const waitForRouterInit = async (router: DataRouter) => {
  await waitFor(() => {
    expect(router.state.initialized).toBe(true)
  })
  // Flush the startTransition-driven commit before callers assert on the DOM.
  await act(async () => {
    await Promise.resolve()
  })
}
