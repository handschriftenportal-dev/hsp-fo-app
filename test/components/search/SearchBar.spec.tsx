import { render, screen } from '@testing-library/react'
import { HspThemeProvider } from 'hsp-web-module'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'
import { makeStore } from 'test/testutils/makeStore'

import { SearchBar } from 'src/components/search/SearchBar'
import { searchActions } from 'src/contexts/actions/searchActions'
import { initI18n } from 'src/contexts/i18n'
import { TrackerProvider } from 'src/contexts/tracking'
import {
  ParsedSearchParams,
  parseFromSearchParams,
} from 'src/utils/searchparams'

import '../../mocks'

initI18n({ doNotTranslate: true })

const renderSearchBarAt = (url: string, mirror: ParsedSearchParams) => {
  const store = makeStore()
  // Seed the cross-route memory of the last search.
  store.dispatch(searchActions.setSearchParams(mirror))
  render(
    <Provider store={store}>
      <HspThemeProvider>
        <TrackerProvider>
          <MemoryRouter initialEntries={[url]}>
            <SearchBar />
          </MemoryRouter>
        </TrackerProvider>
      </HspThemeProvider>
    </Provider>,
  )
  return { store }
}

const submitHref = () =>
  screen
    .getAllByRole('link')
    .map((a) => a.getAttribute('href') ?? '')
    .find((h) => h.includes('/search?') && !h.includes('/search/extended'))

const extendedHref = () =>
  screen
    .getAllByRole('link')
    .map((a) => a.getAttribute('href') ?? '')
    .find((h) => h.includes('/search/extended'))

const paramsOf = (href: string) =>
  parseFromSearchParams(new URLSearchParams(href.split('?')[1] ?? ''))

describe('SearchBar', () => {
  // ------------------------------------------------------
  it('does not reset the remembered search params when mounted on home', () => {
    // The bar is just an entry point on the home page; it must not write the
    // shared memory. Previously its mount effect reset start to 0, dropping the
    // remembered result page on return via the sidebar "Suche" link (#24550).
    const { store } = renderSearchBarAt('/', {
      q: 'abc',
      hl: true,
      start: 20,
      sort: 'ms-identifier-desc',
    })

    const mirror = store.getState().search.searchParams
    expect(mirror).toEqual({
      q: 'abc',
      hl: true,
      start: 20,
      sort: 'ms-identifier-desc',
    })
  })

  // ------------------------------------------------------
  it('builds a page-1 search target that reflects the current term', () => {
    renderSearchBarAt('/search?q=abc&hl=true&start=20', { q: 'abc', start: 20 })

    const href = submitHref() ?? ''
    expect(href).toContain('q=abc')
    // A submitted search always starts on page 1.
    expect(href).not.toContain('start=20')
  })

  // ------------------------------------------------------
  it('carries the full prior search state into the extended-search link', () => {
    // "Extended Search" only navigates to the extended view; "Discard" rebuilds
    // its target from that URL, so every search-state param (query, field, sort,
    // rows, filters and the result page) must survive the hop unchanged. The page
    // was the one field that previously got reset to 1 (#24550).
    const url =
      '/search?q=abc&hl=true&qf=FIELD-GROUP-SIGNATURE&sort=ms-identifier-desc' +
      '&rows=20&start=40&fq=' +
      encodeURIComponent(JSON.stringify({ 'settlement-display': ['Berlin'] }))

    renderSearchBarAt(url, paramsOf(url))

    expect(paramsOf(extendedHref() ?? '')).toEqual(paramsOf(url))
  })

  // ------------------------------------------------------
  it('falls back to the remembered page for the extended link off the results route', () => {
    // Once inside the extended view the URL no longer carries start, so the
    // extended link must read the remembered page from the shared memory.
    renderSearchBarAt('/search/extended?q=abc', { q: 'abc', start: 40 })

    expect(extendedHref() ?? '').toContain('start=40')
  })
})
