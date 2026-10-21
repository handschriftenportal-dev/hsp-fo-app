import { render, screen } from '@testing-library/react'
import { HspThemeProvider } from 'hsp-web-module'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'
import { makeStore } from 'test/testutils/makeStore'

import { AuthorityFileNavigation } from 'src/components/navigation/shared/AuthorityFileNavigation'
import { searchActions } from 'src/contexts/actions/searchActions'
import { initI18n } from 'src/contexts/i18n'
import { ParsedSearchParams } from 'src/utils/searchparams'

initI18n({ doNotTranslate: true })

const renderNavigation = (searchParams: ParsedSearchParams) => {
  const store = makeStore()
  store.dispatch(searchActions.setSearchParams(searchParams))
  render(
    <Provider store={store}>
      <HspThemeProvider>
        <MemoryRouter
          initialEntries={['/authority-files?authorityfileid=NORM-1']}
        >
          <AuthorityFileNavigation />
        </MemoryRouter>
      </HspThemeProvider>
    </Provider>,
  )
}

describe('AuthorityFileNavigation', () => {
  it('renders no back button when the search state has no manuscript context', () => {
    renderNavigation({})
    expect(screen.queryByRole('link')).toBeNull()
  })

  it('renders the back button to the manuscript from the search state', () => {
    renderNavigation({ hspobjectid: 'HSP-123', q: 'xyz' })
    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toContain('hspobjectid=HSP-123')
  })
})
