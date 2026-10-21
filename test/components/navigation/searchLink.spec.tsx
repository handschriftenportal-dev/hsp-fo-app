import { expect, test } from '@jest/globals'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { HspThemeProvider, hspTheme } from 'hsp-web-module'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router'
import {
  createMatchMedia,
  createTestRouter,
  waitForRouterInit,
} from 'test/testutils'
import { makeStore } from 'test/testutils/makeStore'

import { Navigation } from 'src/components/navigation'
import { searchActions } from 'src/contexts/actions/searchActions'
import { FeatureFlagsProvider } from 'src/contexts/features'
import { initI18n } from 'src/contexts/i18n'
import { ModuleContext, createHspModules } from 'src/contexts/modules'
import { TrackerProvider } from 'src/contexts/tracking'
import { MenusProps } from 'src/contexts/wordpress'
import { ParsedSearchParams } from 'src/utils/searchparams'

import '../../mocks'

// <Login> in the sidebar calls useKeycloak(); mock it to avoid wiring up a
// KeycloakProvider.
jest.mock('src/contexts/Keycloak', () =>
  jest.requireActual('test/testutils/keycloakMock'),
)

// CmsMenu calls useLoaderData(); empty arrays are enough to render nothing.
const emptyMenus: MenusProps = { de: [], en: [] }

const sm = hspTheme.breakpoints?.values?.sm
if (sm === undefined) {
  throw new Error('Could not find breakpoint values')
}

const reactQueryClient = new QueryClient()

beforeAll(() => {
  // Force the desktop breakpoint so the sidebar Menu renders the web version.
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: createMatchMedia(sm),
  })
})

const renderNavigationAt = async (
  url: string,
  rememberedSearchParams: ParsedSearchParams,
) => {
  initI18n({ doNotTranslate: true })
  const store = makeStore()
  // Seed the Redux "last search" mirror that the sidebar link falls back to
  // off-route. On /search the link must ignore this and read the live URL.
  store.dispatch(searchActions.setSearchParams(rememberedSearchParams))
  const modules = createHspModules()

  const router = createTestRouter(
    [
      {
        path: '/',
        element: <Navigation Outlet={<div />} />,
        loader: () => emptyMenus,
      },
      {
        path: '/search',
        element: <Navigation Outlet={<div />} />,
        loader: () => emptyMenus,
      },
    ],
    { initialEntries: [url] },
  )

  render(
    <QueryClientProvider client={reactQueryClient}>
      <HspThemeProvider>
        <Provider store={store}>
          <FeatureFlagsProvider>
            <TrackerProvider>
              <ModuleContext.Provider value={modules}>
                <RouterProvider router={router} />
              </ModuleContext.Provider>
            </TrackerProvider>
          </FeatureFlagsProvider>
        </Provider>
      </HspThemeProvider>
    </QueryClientProvider>,
  )

  await waitForRouterInit(router)

  return {
    store,
    searchLink: screen.getByRole('link', { name: 'sidebar.pages.search' }),
  }
}

describe('sidebar "Suche" link', () => {
  // ------------------------------------------------------
  test('on /search reads the live URL, not the lagging Redux mirror', async () => {
    // Mirror is stale (the race: URL already advanced to start=20, the
    // post-paint sync effect in Search.tsx has not committed yet).
    const { searchLink } = await renderNavigationAt(
      '/search?q=abc&hl=true&start=20',
      { q: 'STALE' },
    )

    const href = searchLink.getAttribute('href') ?? ''
    expect(href).toContain('q=abc')
    expect(href).toContain('start=20')
    expect(href).not.toContain('STALE')
  })

  // ------------------------------------------------------
  test('off /search falls back to the remembered last search in Redux', async () => {
    // The home URL carries no search params, so the link must use the mirror.
    const { searchLink } = await renderNavigationAt('/', {
      q: 'remembered',
      hl: true,
      start: 40,
    })

    const href = searchLink.getAttribute('href') ?? ''
    expect(href).toContain('q=remembered')
    expect(href).toContain('start=40')
  })

  // ------------------------------------------------------
  test('leaving /search stamps the live URL into the off-route memory', async () => {
    // Reproduces the "keeps start params" race: the URL is on page 3
    // (start=20) but the Redux mirror is empty (sync effect not committed, and
    // SearchBar resets start to 0). Clicking a sidebar link to leave /search
    // must persist the live URL so the off-route "Suche" link stays correct.
    const { store } = await renderNavigationAt(
      '/search?q=abc&hl=true&start=20',
      {},
    )

    fireEvent.click(screen.getByRole('link', { name: 'sidebar.pages.home' }))

    await waitFor(() => {
      const mirror = store.getState().search.searchParams
      expect(mirror.q).toBe('abc')
      expect(mirror.start).toBe(20)
    })
  })
})
