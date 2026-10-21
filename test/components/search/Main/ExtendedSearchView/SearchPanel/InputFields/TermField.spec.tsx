import { configureStore } from '@reduxjs/toolkit'
import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'

import TermField from '../../../../../../../src/components/search/Main/ExtendedSearchView/SearchPanel/InputFields/TermField'

// Mock der Abhängigkeiten
jest.mock('src/components/search/utils', () => ({
  useSearchTranslation: () => ({
    searchT: (namespace: string, key: string, value?: string): string =>
      value ? `${namespace}.${key}.${value}` : `${namespace}.${key}`,
  }),
}))

jest.mock('src/components/search/shared/SearchInput', () => ({
  SearchInputField: ({
    searchTerm,
    handleInputChange,
    handleResetClick,
  }: any) => (
    <div>
      <input
        data-testid="search-input"
        value={searchTerm}
        onChange={handleInputChange}
      />
      <button data-testid="reset-button" onClick={handleResetClick}>
        Reset
      </button>
    </div>
  ),
}))

jest.mock('src/contexts/actions/searchActions', () => ({
  searchActions: {
    setNewExtSearchValue: jest.fn((payload) => ({
      type: 'SET_NEW_EXT_SEARCH_VALUE',
      payload,
    })),
  },
}))

jest.mock('src/contexts/selectors', () => ({
  extSearchSelectors: {
    getExtendedFieldInfo: (state: any) => state.search.extFieldInfo,
  },
}))

// Helper-Funktion zum Erstellen eines Test-Stores
const createTestStore = (extFieldInfo: any[] = []) => {
  const mockDispatch = jest.fn()

  const store = configureStore({
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

  return { store, mockDispatch }
}

describe('TermField', () => {
  const defaultProps = {
    index: 0,
    fieldType: 'text',
    searchTerm: '',
    handleInputKeyDown: jest.fn(),
    searchField: 'testField',
    groupId: 'group1',
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('sollte ein Text-Eingabefeld für Typ "text" rendern', () => {
    const { store } = createTestStore([{ name: 'testField', values: null }])

    render(
      <Provider store={store}>
        <TermField aria-label={''} {...defaultProps} />
      </Provider>,
    )

    expect(screen.getByTestId('search-input')).toBeDefined()
  })

  it('sollte ein Select-Feld für Typ "enum" mit Werten rendern', () => {
    const { store } = createTestStore([
      { name: 'testField', values: ['option1', 'option2', 'option3'] },
    ])

    render(
      <Provider store={store}>
        <TermField aria-label={''} {...defaultProps} fieldType="enum" />
      </Provider>,
    )

    expect(screen.getByRole('combobox')).toBeDefined()
  })

  it('sollte ein Select-Feld für Typ "boolean" rendern', () => {
    const { store } = createTestStore([{ name: 'testField', values: null }])

    render(
      <Provider store={store}>
        <TermField aria-label={''} {...defaultProps} fieldType="boolean" />
      </Provider>,
    )

    const selectElement = screen.getByRole('combobox')
    expect(selectElement).toBeDefined()
  })

  it('sollte Action bei Eingabeänderung dispatchen', () => {
    const { store, mockDispatch } = createTestStore([
      { name: 'testField', values: null },
    ])

    render(
      <Provider store={store}>
        <TermField aria-label={''} {...defaultProps} searchTerm="test" />
      </Provider>,
    )

    fireEvent.change(screen.getByTestId('search-input'), {
      target: { value: 'new value' },
    })

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_NEW_EXT_SEARCH_VALUE',
      payload: {
        index: 0,
        value: 'new value',
        groupId: 'group1',
        property: 'searchTerm',
      },
    })
  })

  it('sollte Action beim Reset-Klick dispatchen', () => {
    const { store, mockDispatch } = createTestStore([
      { name: 'testField', values: null },
    ])

    render(
      <Provider store={store}>
        <TermField aria-label={''} {...defaultProps} searchTerm="test" />
      </Provider>,
    )

    fireEvent.click(screen.getByTestId('reset-button'))

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_NEW_EXT_SEARCH_VALUE',
      payload: {
        index: 0,
        value: '',
        groupId: 'group1',
        property: 'searchTerm',
      },
    })
  })

  it('sollte MenuItem-Optionen für enum-Felder anzeigen', () => {
    const { store } = createTestStore([
      { name: 'testField', values: ['option1', 'option2'] },
    ])

    render(
      <Provider store={store}>
        <TermField
          aria-label={''}
          {...defaultProps}
          fieldType="enum"
          searchTerm="option1"
        />
      </Provider>,
    )

    const select = screen.getByRole('combobox')
    fireEvent.mouseDown(select)

    // Verwende getAllByText statt getByText, da der Text mehrfach vorkommt
    const option1Elements = screen.getAllByText('data.testField.option1')
    const option2Elements = screen.getAllByText('data.testField.option2')

    expect(option1Elements.length).toBeGreaterThan(0)
    expect(option2Elements.length).toBeGreaterThan(0)
  })

  it('sollte boolean-Optionen true/false anzeigen', () => {
    const { store } = createTestStore([{ name: 'testField', values: null }])

    render(
      <Provider store={store}>
        <TermField
          aria-label={''}
          {...defaultProps}
          fieldType="boolean"
          searchTerm="true"
        />
      </Provider>,
    )

    const select = screen.getByRole('combobox')
    fireEvent.mouseDown(select)

    // Verwende getAllByText statt getByText, da der Text mehrfach vorkommt
    const trueElements = screen.getAllByText('data.testField.true')
    const falseElements = screen.getAllByText('data.testField.false')

    expect(trueElements.length).toBeGreaterThan(0)
    expect(falseElements.length).toBeGreaterThan(0)
  })

  it('sollte leeren Wert setzen wenn searchTerm nicht in enum-Werten enthalten ist', () => {
    const { store } = createTestStore([
      { name: 'testField', values: ['option1', 'option2'] },
    ])

    render(
      <Provider store={store}>
        <TermField
          aria-label={''}
          {...defaultProps}
          fieldType="enum"
          searchTerm="invalidOption"
        />
      </Provider>,
    )

    const select = screen.getByRole('combobox')
    // Prüfe ob das Select-Element leer ist (nur zero-width space)
    expect(select.textContent).toBe('\u200b') // Zero-width space
  })
})
