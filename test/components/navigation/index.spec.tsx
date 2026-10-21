import { expect, test } from '@jest/globals'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { HspThemeProvider, hspTheme } from 'hsp-web-module'
import i18next from 'i18next'
import { ReactElement } from 'react'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router'
import {
  createMatchMedia,
  createTestRouter,
  spyOnAction,
  waitForRouterInit,
} from 'test/testutils'
import { makeStore } from 'test/testutils/makeStore'

import { Navigation } from 'src/components/navigation'
import { useScrollContainer } from 'src/components/navigation/mobile/ScrollContainerContext'
import { actions } from 'src/contexts/actions/actions'
import { FeatureFlagsProvider } from 'src/contexts/features'
import { initI18n } from 'src/contexts/i18n'
import { ModuleContext, createHspModules } from 'src/contexts/modules'
import { TrackerProvider } from 'src/contexts/tracking'
import { MenusProps } from 'src/contexts/wordpress'

import '../../mocks'

// <Login> in the sidebar calls useKeycloak(); mock it to avoid wiring
// up a KeycloakProvider.
jest.mock('src/contexts/Keycloak', () =>
  jest.requireActual('test/testutils/keycloakMock'),
)

// CmsMenu calls useLoaderData() for the WordPress menu structure; empty
// arrays are sufficient since CmsMenu iterates them and renders nothing.
const emptyMenus: MenusProps = { de: [], en: [] }

// Renders the data-testid of the scroll container the layout exposes via
// context (or "none"), so a test can assert which layout provides one.
const ScrollProbe = () => {
  const scrollContainer = useScrollContainer()
  return (
    <div data-testid="scroll-probe">
      {scrollContainer?.getAttribute('data-testid') ?? 'none'}
    </div>
  )
}

// We are going to run the tests on different screen sizes.
// First of all check if the theme has the relevant breakpoints
const xs = hspTheme.breakpoints?.values?.xs
const sm = hspTheme.breakpoints?.values?.sm

if (xs === undefined || sm === undefined) {
  throw new Error('Could not find breakpoint values')
}

const reactQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 3 * 60 * 1000,
      retry: 3,
    },
  },
})

async function renderNavigation(outlet: ReactElement = <div />) {
  initI18n({ doNotTranslate: true })
  const store = makeStore()
  const modules = createHspModules()

  const router = createTestRouter([
    {
      path: '/',
      element: <Navigation Outlet={outlet} />,
      loader: () => emptyMenus,
    },
  ])

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
}

function commonTests() {
  // ------------------------------------------------------
  test('renders the logo with an link to "/"', async function () {
    await renderNavigation()

    fireEvent.click(
      await screen.findByRole('link', { name: 'topBar.logoLink' }),
    )

    await waitFor(() => {
      expect(window.location.href).toBe('http://localhost/')
    })
  })

  // ------------------------------------------------------
  test('sidebar button triggers the toggleSidebar action', async function () {
    const toggleSidebar = spyOnAction(actions, 'toggleSidebar')
    await renderNavigation()

    expect(toggleSidebar).toHaveBeenCalledTimes(0)
    fireEvent.click(
      screen.getByRole('button', { name: 'topBar.expandSidebar' }),
    )
    expect(toggleSidebar).toHaveBeenCalledTimes(1)
    fireEvent.click(
      screen.getByRole('button', { name: 'topBar.collapseSidebar' }),
    )
    expect(toggleSidebar).toHaveBeenCalledTimes(2)

    toggleSidebar.mockRestore()
  })

  // ------------------------------------------------------
  test('side bar contains the miscellaneous links', async function () {
    await renderNavigation()
    // Miscellaneous links are rendered by <Footer> and are visible
    // without expanding the sidebar. Under MUI 7 they use <ListItemButton
    // component={Link}>, which renders an <a> with the implicit role="link"
    // (MUI 4's <ListItem button> applied the role="button" ARIA antipattern).
    expect(
      screen.getByRole('link', { name: 'sidebar.misc.legal' }),
    ).toBeTruthy()
    expect(
      screen.getByRole('link', { name: 'sidebar.misc.accessibility' }),
    ).toBeTruthy()
  })

  // ------------------------------------------------------
  test('side bar contains global tools: language and feedback', async function () {
    await renderNavigation()
    // open sidebar
    fireEvent.click(
      screen.getByRole('button', { name: 'topBar.expandSidebar' }),
    )

    expect(
      screen.getByRole('button', { name: 'sidebar.tools.language' }),
    ).toBeTruthy()
    expect(
      screen.getByRole('link', { name: 'sidebar.tools.feedback' }),
    ).toBeTruthy()
  })

  // ------------------------------------------------------
  test('change language via language dialog', async function () {
    await renderNavigation()
    // open sidebar
    fireEvent.click(
      screen.getByRole('button', { name: 'topBar.expandSidebar' }),
    )
    // open language dialog
    fireEvent.click(
      screen.getByRole('button', { name: 'sidebar.tools.language' }),
    )
    // 'none' is default language because i18next was initialized with 'doNoTranslate' (see renderNavigation())
    expect(i18next.language).toBe('none')

    // change language to Deutsch
    fireEvent.click(screen.getByRole('button', { name: 'Deutsch' }))
    expect(i18next.language).toBe('de')
  })

  // ------------------------------------------------------
  test('renders all page links in the sidebar', async function () {
    await renderNavigation()
    // open sidebar
    fireEvent.click(
      screen.getByRole('button', { name: 'topBar.expandSidebar' }),
    )

    const homeLink = screen.getByRole('link', { name: 'sidebar.pages.home' })
    expect(homeLink.getAttribute('href')?.endsWith('/')).toBe(true)

    const searchLink = screen.getByRole('link', {
      name: 'sidebar.pages.search',
    })
    expect(searchLink.getAttribute('href')?.endsWith('/search')).toBe(true)

    const workspaceLink = screen.getByRole('link', {
      name: 'sidebar.pages.workspace',
    })
    expect(workspaceLink.getAttribute('href')?.endsWith('/workspace')).toBe(
      true,
    )
  })
}

describe('<Navigation/> web version', function () {
  beforeAll(() => {
    ;(window as any).matchMedia = createMatchMedia(sm)
  })

  // ------------------------------------------------------
  test('renders web version if breakpoint is sm', async function () {
    await renderNavigation()

    expect(await screen.findByTestId('navigation-web')).toBeTruthy()
  })

  // ------------------------------------------------------
  test('does not expose a scroll container to descendants', async function () {
    // The web header is permanently pinned, so there is nothing to share.
    await renderNavigation(<ScrollProbe />)

    expect(screen.getByTestId('scroll-probe').textContent).toBe('none')
  })

  commonTests()
})

describe('<Navigation/> mobile version', function () {
  beforeAll(() => {
    ;(window as any).matchMedia = createMatchMedia(xs + 1) // make sure it's not 0
  })

  // ------------------------------------------------------
  test('renders mobile version if breakpoint is xs', async function () {
    await renderNavigation()

    expect(await screen.findByTestId('navigation-mobile')).toBeTruthy()
  })

  // ------------------------------------------------------
  test('exposes its scroll container to descendants via context', async function () {
    // Descendants read the same element the hide-on-scroll header uses (#24567).
    await renderNavigation(<ScrollProbe />)

    await waitFor(() =>
      expect(screen.getByTestId('scroll-probe').textContent).toBe(
        'navigation-mobile',
      ),
    )
  })

  commonTests()
})
