import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { HspThemeProvider } from 'hsp-web-module'
import React from 'react'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router'
import 'whatwg-fetch'

import { createTestRouter } from './createTestRouter'
import { makeStore } from './makeStore'
import { waitForRouterInit } from './waitForRouterInit'

export async function renderWithProviders(
  element: React.JSX.Element,
  loaderData?: Record<string, unknown>,
) {
  const store = makeStore()
  const queryClient = new QueryClient()

  const router = createTestRouter([
    {
      path: '/',
      element,
      ...(loaderData ? { loader: () => loaderData } : {}),
    },
  ])

  const view = render(
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <HspThemeProvider>
          <RouterProvider router={router} />
        </HspThemeProvider>
      </Provider>
    </QueryClientProvider>,
  )

  if (loaderData) {
    await waitForRouterInit(router)
  }

  return view
}
