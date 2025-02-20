import { render } from '@testing-library/react'
import { HspThemeProvider } from 'hsp-web-module'
import React from 'react'
import { Provider } from 'react-redux'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import 'whatwg-fetch'

import { makeStore } from './makeStore'

export function renderWithProviders(
  element: React.JSX.Element,
  loaderData?: Record<string, unknown>,
) {
  const store = makeStore()

  const createRouter = (element: React.JSX.Element) =>
    createMemoryRouter([
      {
        path: '/',
        element,
        ...(loaderData ? { loader: () => loaderData } : {}),
      },
    ])

  const router = createRouter(element)

  return render(
    <Provider store={store}>
      <HspThemeProvider>
        <RouterProvider router={router} />
      </HspThemeProvider>
    </Provider>,
  )
}
