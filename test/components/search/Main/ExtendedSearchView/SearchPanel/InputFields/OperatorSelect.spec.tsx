import { configureStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { HspThemeProvider } from 'hsp-web-module'
import { Provider } from 'react-redux'

import OperatorSelect from '../../../../../../../src/components/search/Main/ExtendedSearchView/SearchPanel/InputFields/OperatorSelect'

jest.mock('src/contexts/selectors', () => ({
  extSearchSelectors: {
    getExtendedFieldInfo: (state: any) => state.search.extFieldInfo,
  },
}))

jest.mock('src/components/search/utils', () => ({
  useSearchTranslation: () => ({
    searchT: (namespace: string, key: string, value?: string): string =>
      value ? `${namespace}.${key}.${value}` : `${namespace}.${key}`,
  }),
}))

const createTestStore = (extFieldInfo: any[] = []) => {
  const mockDispatch = jest.fn()

  return configureStore({
    reducer: {
      search: (state = { extFieldInfo }) => state,
    },
    preloadedState: {
      search: { extFieldInfo },
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(() => (next) => (action) => {
        mockDispatch(action)
        return next(action)
      }),
  })
}

describe('OperatorSelect Extended Search', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders operator select for a text field with enum values', () => {
    const store = createTestStore([
      { name: 'material-search', values: ['linen', 'paper'] },
    ])

    render(
      <HspThemeProvider>
        <Provider store={store}>
          <OperatorSelect
            index={0}
            searchOperator={'=='}
            fieldType={'text'}
            groupId={'2'}
            searchField={'material-search'}
          />
        </Provider>
      </HspThemeProvider>,
    )

    expect(screen.getByTestId('extendedSearchOperator')).toBeDefined()
    expect(screen.getAllByText('extendedSearch.is')).toBeDefined()
  })
})
