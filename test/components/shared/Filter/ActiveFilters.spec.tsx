import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { HspThemeProvider } from 'hsp-web-module'
import { Provider } from 'react-redux'
import { RouterProvider, useLocation } from 'react-router'
import { createTestRouter } from 'test/testutils'
import { makeStore } from 'test/testutils/makeStore'
import 'whatwg-fetch'

import { ActiveFilters } from 'src/components/shared/Filter/ActiveFilters'
import { initI18n } from 'src/contexts/i18n'
import { FilterQuery, toSearchParams } from 'src/utils/searchparams'

initI18n({ doNotTranslate: true })

// Surfaces the live router location so assertions can read the resulting `fq`.
const LocationProbe = () => {
  const location = useLocation()
  return <span data-testid="search">{location.search}</span>
}

const renderActiveFilters = (fq: FilterQuery) => {
  const store = makeStore()
  const initialUrl = `/search?${toSearchParams({ hl: true, fq })}`

  // An async loader defers the navigation commit past a synchronous click
  // burst, mirroring the production data-router (createBrowserRouter) where the
  // URL only updates after the route loader resolves.
  const router = createTestRouter(
    [
      {
        path: '/search',
        loader: async () => null,
        element: (
          <>
            <ActiveFilters />
            <LocationProbe />
          </>
        ),
      },
    ],
    { initialEntries: [initialUrl] },
  )

  render(
    <Provider store={store}>
      <HspThemeProvider>
        <RouterProvider router={router} />
      </HspThemeProvider>
    </Provider>,
  )
}

const getSearch = () => screen.getByTestId('search').textContent ?? ''

const getFq = (): FilterQuery | null => {
  const raw = new URLSearchParams(getSearch()).get('fq')
  return raw ? (JSON.parse(raw) as FilterQuery) : null
}

// Chip remove buttons render in `Object.keys(fq)` order, followed by the
// "remove all" button. `findAllByRole('button')` returns them in that order.
const getChipButtons = async () => {
  return screen.findAllByRole('button')
}

describe('ActiveFilters chip removal', () => {
  it('removes a single multivalue chip but keeps the other values of the facet', async () => {
    renderActiveFilters({ 'settlement-facet': ['München', 'Berlin'] })
    const buttons = await getChipButtons()

    fireEvent.click(buttons[0]) // remove "München"

    await waitFor(() =>
      expect(getFq()).toEqual({ 'settlement-facet': ['Berlin'] }),
    )
  })

  it('drops the facet key when its last value is removed', async () => {
    renderActiveFilters({
      'settlement-facet': ['München'],
      'language-facet': ['NORM-de'],
    })
    const buttons = await getChipButtons()

    fireEvent.click(buttons[0]) // remove the only settlement value

    await waitFor(() =>
      expect(getFq()).toEqual({ 'language-facet': ['NORM-de'] }),
    )
  })

  it('drops fq from the URL entirely when the last remaining facet is removed', async () => {
    renderActiveFilters({ 'settlement-facet': ['München'] })
    const buttons = await getChipButtons()

    fireEvent.click(buttons[0])

    await waitFor(() => expect(getSearch()).not.toContain('fq='))
    expect(getFq()).toBeNull()
  })

  it('removes a boolean facet chip via key omission', async () => {
    renderActiveFilters({
      'digitized-object-facet': [true],
      'settlement-facet': ['München'],
    })
    const buttons = await getChipButtons()

    fireEvent.click(buttons[0]) // remove the boolean chip

    await waitFor(() =>
      expect(getFq()).toEqual({ 'settlement-facet': ['München'] }),
    )
  })

  it('removes a range facet chip via key omission', async () => {
    renderActiveFilters({
      'orig-date-facet': { from: 1000, to: 1500 },
      'settlement-facet': ['München'],
    })
    const buttons = await getChipButtons()

    fireEvent.click(buttons[0]) // remove the range chip

    await waitFor(() =>
      expect(getFq()).toEqual({ 'settlement-facet': ['München'] }),
    )
  })

  it('composes rapid successive removals instead of dropping all but the last', async () => {
    renderActiveFilters({
      'digitized-iiif-object-facet': [true],
      'digitized-object-facet': [true],
      'settlement-facet': ['München'],
      'language-facet': ['NORM-5f02f088'],
    })
    const buttons = await getChipButtons()
    // [0] iiif, [1] digitized-object, [2] settlement, [3] language, [4] remove-all
    const initialSearch = getSearch()

    // Fire three removals synchronously, before React re-renders between them.
    fireEvent.click(buttons[2]) // Ort: München (string)
    fireEvent.click(buttons[3]) // Deutsch (string)
    fireEvent.click(buttons[1]) // Digitalisate vorhanden (boolean)

    await waitFor(() => expect(getSearch()).not.toBe(initialSearch))
    expect(getFq()).toEqual({ 'digitized-iiif-object-facet': [true] })
  })
})
