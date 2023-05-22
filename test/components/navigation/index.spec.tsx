/*
 * MIT License
 *
 * Copyright (c) 2023 Staatsbibliothek zu Berlin - Preußischer Kulturbesitz
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

// because cypress shadows some jest globals by mocha/chai globals
import { expect, test } from '@jest/globals'
import React from 'react'
import { screen, render, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { createMatchMedia, spyOnAction } from 'test/testutils'
import { hspTheme, HspThemeProvider } from 'hsp-web-module'
import { actions, makeStore } from 'src/contexts/state'
import { initI18n } from 'src/contexts/i18n'
import { Tracker, TrackerContext } from 'src/contexts/tracking'
import { ModuleContext, createHspModules } from 'src/contexts/modules'
import { FeatureFlags, FeatureFlagsContext } from 'src/contexts/features'
import { Navigation } from 'src/components/navigation'
import '../../mocks'
import i18next from 'i18next'

// We are going to run the tests on different screen sizes.
// First of all check if the theme has the relevant breakpoints
const xs = hspTheme.breakpoints?.values?.xs
const sm = hspTheme.breakpoints?.values?.sm

if (xs === undefined || sm === undefined) {
  throw new Error('Could not find breakpoint values')
}

function renderNavigation(args?: { main?: Element; topBarTools?: Element }) {
  initI18n({ doNotTranslate: true })
  const store = makeStore()
  const tracker = new Tracker()
  const featureFlags = new FeatureFlags()
  const modules = createHspModules()

  render(
    <HspThemeProvider>
      <Provider store={store}>
        <FeatureFlagsContext.Provider value={featureFlags}>
          <TrackerContext.Provider value={tracker}>
            <ModuleContext.Provider value={modules}>
              <BrowserRouter>
                <Navigation main={args?.main} topBarTools={args?.topBarTools} />
              </BrowserRouter>
            </ModuleContext.Provider>
          </TrackerContext.Provider>
        </FeatureFlagsContext.Provider>
      </Provider>
    </HspThemeProvider>
  )
}

function commonTests() {
  // ------------------------------------------------------
  test('renders the logo with an link to "/"', async function () {
    renderNavigation()

    fireEvent.click(
      await screen.findByRole('link', { name: 'topBar.logoLink' })
    )

    await waitFor(() => {
      expect(window.location.href).toBe('http://localhost/')
    })
  })

  // ------------------------------------------------------
  test('sidebar button triggers the toggleSidebar action', async function () {
    const toggleSidebar = spyOnAction(actions, 'toggleSidebar')
    renderNavigation()

    expect(toggleSidebar).toHaveBeenCalledTimes(0)
    fireEvent.click(
      screen.getByRole('button', { name: 'topBar.expandSidebar' })
    )
    expect(toggleSidebar).toHaveBeenCalledTimes(1)
    fireEvent.click(
      screen.getByRole('button', { name: 'topBar.collapseSidebar' })
    )
    expect(toggleSidebar).toHaveBeenCalledTimes(2)

    await waitFor(() => {})
    toggleSidebar.mockRestore()
  })

  // ------------------------------------------------------
  test('renders the main and topbar tools elements passed via props', async function () {
    const main = document.createElement('div')
    main.textContent = 'main element'
    const topBarTools = document.createElement('div')
    topBarTools.textContent = 'top bar tools element'

    renderNavigation({ main, topBarTools })

    screen.getByText('main element')
    screen.getByText('top bar tools element')
    await waitFor(() => {})
  })

  // ------------------------------------------------------
  test('side bar contains the miscellaneous links', async function () {
    renderNavigation()
    // open sidebar
    fireEvent.click(
      screen.getByRole('button', { name: 'topBar.expandSidebar' })
    )

    screen.getByRole('link', { name: 'sidebar.misc.accessibility' })
    screen.getByRole('link', { name: 'sidebar.misc.legal' })
    await waitFor(() => {})
  })

  // ------------------------------------------------------
  test('side bar contains global tools: language and feedback', async function () {
    renderNavigation()
    // open sidebar
    fireEvent.click(
      screen.getByRole('button', { name: 'topBar.expandSidebar' })
    )

    screen.getByRole('button', { name: 'sidebar.tools.language' })
    screen.getByRole('link', { name: 'sidebar.tools.feedback' })
    await waitFor(() => {})
  })

  // ------------------------------------------------------
  test('change language via language dialog', async function () {
    renderNavigation()
    // open sidebar
    fireEvent.click(
      screen.getByRole('button', { name: 'topBar.expandSidebar' })
    )
    // open language dialog
    fireEvent.click(
      screen.getByRole('button', { name: 'sidebar.tools.language' })
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
    renderNavigation()

    // open sidebar
    fireEvent.click(
      screen.getByRole('button', { name: 'topBar.expandSidebar' })
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
      true
    )

    // The cms menu items are fetched async. See mocks/hsp-cms.ts
    const cmsPageLink = await screen.findByRole('link', { name: 'News' })
    expect(cmsPageLink.getAttribute('href')?.endsWith('/info?pageId=400')).toBe(
      true
    )

    await waitFor(() => {})
  })
}

describe('<Navigation/> web version', function () {
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

describe('<Navigation/> mobile version', function () {
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
