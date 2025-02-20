import { expect, test } from '@jest/globals'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { HspThemeProvider, hspTheme } from 'hsp-web-module'
import i18next from 'i18next'
import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { createMatchMedia, spyOnAction } from 'test/testutils'
import { makeStore } from 'test/testutils/makeStore'

import { Navigation } from 'src/components/navigation'
import { actions } from 'src/contexts/actions/actions'
import { FeatureFlagsProvider } from 'src/contexts/features'
import { initI18n } from 'src/contexts/i18n'
import { ModuleContext, createHspModules } from 'src/contexts/modules'
import { TrackerProvider } from 'src/contexts/tracking'

import '../../mocks'

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

function renderNavigation() {
  initI18n({ doNotTranslate: true })
  const store = makeStore()
  const modules = createHspModules()

  render(
    <QueryClientProvider client={reactQueryClient}>
      <HspThemeProvider>
        <Provider store={store}>
          <FeatureFlagsProvider>
            <TrackerProvider>
              <ModuleContext.Provider value={modules}>
                <BrowserRouter>
                  <Navigation Outlet={<div />} />
                </BrowserRouter>
              </ModuleContext.Provider>
            </TrackerProvider>
          </FeatureFlagsProvider>
        </Provider>
      </HspThemeProvider>
    </QueryClientProvider>,
  )
}

function commonTests() {
  // ------------------------------------------------------
  test('renders the logo with an link to "/"', async function () {
    act(() => {
      renderNavigation()
    })

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
    act(() => {
      renderNavigation()
    })

    expect(toggleSidebar).toHaveBeenCalledTimes(0)
    fireEvent.click(
      screen.getByRole('button', { name: 'topBar.expandSidebar' }),
    )
    expect(toggleSidebar).toHaveBeenCalledTimes(1)
    fireEvent.click(
      screen.getByRole('button', { name: 'topBar.collapseSidebar' }),
    )
    expect(toggleSidebar).toHaveBeenCalledTimes(2)

    await waitFor(() => {})
    toggleSidebar.mockRestore()
  })

  // ------------------------------------------------------
  test('side bar contains the miscellaneous links', async function () {
    act(() => {
      renderNavigation()
    })
    // open sidebar
    fireEvent.click(
      screen.getByRole('button', { name: 'topBar.expandSidebar' }),
    )

    await waitFor(() => {})
  })

  // ------------------------------------------------------
  test('side bar contains global tools: language and feedback', async function () {
    act(() => {
      renderNavigation()
    })
    // open sidebar
    fireEvent.click(
      screen.getByRole('button', { name: 'topBar.expandSidebar' }),
    )

    screen.getByRole('button', { name: 'sidebar.tools.language' })
    screen.getByRole('button', { name: 'sidebar.tools.feedback' })
    await waitFor(() => {})
  })

  // ------------------------------------------------------
  test('change language via language dialog', async function () {
    act(() => {
      renderNavigation()
    })
    // open sidebar
    fireEvent.click(
      screen.getByRole('button', { name: 'topBar.expandSidebar' }),
    )
    // open language dialog
    fireEvent.click(
      screen.getByRole('button', { name: 'sidebar.tools.language' }),
    )
    // 'none' is default language because i18next was initialized with 'doNoTransalte' (see renderNavigation())
    expect(i18next.language).toBe('none')

    // change language to Deutsch
    fireEvent.click(screen.getByRole('button', { name: 'Deutsch' }))
    expect(i18next.language).toBe('de')

    await waitFor(() => {})
  })

  // ------------------------------------------------------
  test('renders all page links in the sidebar', async function () {
    act(() => {
      renderNavigation()
    })
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

xdescribe('<Navigation/> web version', function () {
  beforeAll(() => {
    ;(window as any).matchMedia = createMatchMedia(sm)
  })

  // ------------------------------------------------------
  test('renders web version if breakpoint is sm', async function () {
    renderNavigation()

    await screen.findByTestId('navigation-web')
  })

  commonTests()
})

xdescribe('<Navigation/> mobile version', function () {
  beforeAll(() => {
    ;(window as any).matchMedia = createMatchMedia(xs + 1) // make sure it's not 0
  })

  // ------------------------------------------------------
  test('renders mobile version if breakpoint is xs', async function () {
    renderNavigation()

    await screen.findByTestId('navigation-mobile')
  })

  commonTests()
})
