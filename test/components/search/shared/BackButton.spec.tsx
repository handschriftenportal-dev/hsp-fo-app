import { fireEvent, render, screen } from '@testing-library/react'
import { HspThemeProvider } from 'hsp-web-module'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'
import { makeStore } from 'test/testutils/makeStore'
import { spyOnAction } from 'test/testutils/spyOnAction'

import BackButton from 'src/components/search/shared/BackButton'
import { searchActions } from 'src/contexts/actions/searchActions'
import { initI18n } from 'src/contexts/i18n'
import { ParsedSearchParams } from 'src/utils/searchparams'

initI18n({ doNotTranslate: true })

type BtnType = 'cancel' | 'extendedBtn' | 'back' | 'backToKod'

const renderBackButton = (btnType: BtnType, backParams: ParsedSearchParams) => {
  const setSearchTerm = spyOnAction(searchActions, 'setSearchTerm')
  const store = makeStore()
  render(
    <Provider store={store}>
      <HspThemeProvider>
        <MemoryRouter>
          <BackButton
            backParams={backParams}
            btnType={btnType}
            preventScrollReset={false}
          />
        </MemoryRouter>
      </HspThemeProvider>
    </Provider>,
  )
  return { link: screen.getByRole('link'), setSearchTerm }
}

afterEach(() => jest.restoreAllMocks())

describe('BackButton', () => {
  it('cancel ("Verwerfen") returns to the previous search instead of resetting it', () => {
    const { link, setSearchTerm } = renderBackButton('cancel', {
      q: 'abc',
      hl: true,
      fq: { 'digitized-object-facet': [true] },
      sort: 'score-desc',
    })

    const href = link.getAttribute('href') ?? ''
    expect(href).toContain('q=abc')
    expect(href).toContain('hl=true')
    expect(href).toContain('sort=score-desc')
    expect(href).toContain('fq=')

    fireEvent.click(link)
    expect(setSearchTerm).toHaveBeenCalledWith('abc')
  })

  it('back ("Zurück zur Suche") restores the prior search params from the detail page', () => {
    const { link, setSearchTerm } = renderBackButton('back', {
      q: 'hund',
      hl: true,
      fq: { 'digitized-iiif-object-facet': [true] },
    })

    const href = link.getAttribute('href') ?? ''
    expect(href).toContain('q=hund')
    expect(href).toContain('fq=')

    fireEvent.click(link)
    expect(setSearchTerm).toHaveBeenCalledWith('hund')
  })

  it('extendedBtn ("Zurück zur einfachen Suche") still resets to a bare /search', () => {
    const { link, setSearchTerm } = renderBackButton('extendedBtn', {
      hspobjectid: undefined,
      isExtended: undefined,
    })

    const href = link.getAttribute('href') ?? ''
    expect(href).toMatch(/\/search$/)
    expect(href).not.toContain('?')

    fireEvent.click(link)
    expect(setSearchTerm).toHaveBeenCalledWith('')
  })

  it('backToKod carries the remembered search context', () => {
    const { link, setSearchTerm } = renderBackButton('backToKod', {
      q: 'xyz',
      hl: true,
    })

    expect(link.getAttribute('href') ?? '').toContain('q=xyz')

    fireEvent.click(link)
    expect(setSearchTerm).toHaveBeenCalledWith('xyz')
  })
})
