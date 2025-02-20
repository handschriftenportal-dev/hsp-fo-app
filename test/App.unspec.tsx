import { expect, test } from '@jest/globals'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { HspThemeProvider } from 'hsp-web-module'
import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import { Navigation } from 'src/components/navigation'
import { FeatureFlags, FeatureFlagsContext } from 'src/contexts/features'
import { initI18n } from 'src/contexts/i18n'
import { ModuleContext, createHspModules } from 'src/contexts/modules'
import { makeStore } from 'src/contexts/state'
import { Tracker, TrackerContext } from 'src/contexts/tracking'

import './mocks'

const reactQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 3 * 60 * 1000,
      retry: 3,
    },
  },
})

function renderNavigation(args?: { main?: Element; topBarTools?: Element }) {
  initI18n({ doNotTranslate: true })
  const store = makeStore()
  const tracker = new Tracker()
  const featureFlags = new FeatureFlags()
  const modules = createHspModules()

  render(
    <QueryClientProvider client={reactQueryClient}>
      <HspThemeProvider>
        <Provider store={store}>
          <FeatureFlagsContext.Provider value={featureFlags}>
            <TrackerContext.Provider value={tracker}>
              <ModuleContext.Provider value={modules}>
                <BrowserRouter>
                  <Navigation main={args?.main} />
                </BrowserRouter>
              </ModuleContext.Provider>
            </TrackerContext.Provider>
          </FeatureFlagsContext.Provider>
        </Provider>
      </HspThemeProvider>
    </QueryClientProvider>,
  )
}

test('App: navigate all pages', async function () {
  act(() => {
    renderNavigation()
  })
  fireEvent.click((await screen.findAllByRole('link', { name: /search/i }))[0])
  expect(window.location.href.endsWith('/search')).toBe(true)

  fireEvent.click(
    (await screen.findAllByRole('link', { name: /workspace/i }))[0],
  )
  expect(window.location.href.endsWith('/workspace')).toBe(true)

  fireEvent.click(
    (await screen.findAllByRole('link', { name: /projects/i }))[0],
  )
  expect(window.location.href.endsWith('/projects')).toBe(true)

  fireEvent.click((await screen.findAllByRole('link', { name: /home/i }))[0])
  expect(window.location.href.endsWith('/')).toBe(true)
}, 10000)
