import { expect } from '@jest/globals'
import { axe, toHaveNoViolations } from 'jest-axe'
import { useLoaderData } from 'react-router'
import { hspMockObject } from 'test/mocks/hspMockObjects'
import {
  descriptionMock,
  digitizedMock,
  mockHspObjectsById,
  mockHspObjectsByQuery,
} from 'test/mocks/jestAxeMocks'

import { ExtendedSearchView } from 'src/components/search/Main/ExtendedSearchView'
import { ListView } from 'src/components/search/Main/ListView'
import { Filters } from 'src/components/search/Main/ListView/Filters'
import { Overview } from 'src/components/search/Main/Overview/'
import { HspDescriptions } from 'src/components/search/Main/Overview/HspDescription'
import { HspDigitizeds } from 'src/components/search/Main/Overview/HspDigitized'
import { HspObjects } from 'src/components/search/Main/Overview/HspObject'
import { NormEntry } from 'src/components/search/Main/Overview/HspObject/KeyValueTable/NormEntry'
import { ActiveFilters } from 'src/components/shared/Filter/ActiveFilters'
import { Tools } from 'src/components/shared/Tools'
import * as useHspCatalogById from 'src/contexts/discovery/useHspCatalogById'
import * as useHspObjectsByQuery from 'src/contexts/discovery/useHspObjectsByQuery'
import { initI18n } from 'src/contexts/i18n'

import { renderWithProviders } from '../testutils'

global.scrollTo = jest.fn()

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLoaderData: jest.fn(),
}))
jest.mock('src/contexts/modules', () => ({
  useModules: jest.fn(() => ({})),
}))

jest
  .spyOn(useHspObjectsByQuery, 'useHspObjectsByQuery')
  .mockReturnValue({ data: mockHspObjectsByQuery } as any)

// Stub useHspCatalogById so DescCardContent doesn't fetch /api/catalogs/<id> (a real
// XHR that logs an async ECONNREFUSED). undefined data matches the failed-fetch state.
jest
  .spyOn(useHspCatalogById, 'useHspCatalogById')
  .mockReturnValue({ data: undefined } as any)

expect.extend(toHaveNoViolations)

describe('Extended Search accessibility', function () {
  initI18n({ doNotTranslate: true })

  it('ExtendedSearchView', async () => {
    const { container } = await renderWithProviders(<ExtendedSearchView />)
    expect(container.textContent).toContain('Vorschau')
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

describe('Search accessibility', function () {
  initI18n({ doNotTranslate: true })
  describe('Overview', function () {
    it('Overview', async () => {
      jest.mocked(useLoaderData).mockReturnValue({
        resultList: mockHspObjectsById,
      })

      const { container } = await renderWithProviders(<Overview />)
      expect(container.textContent).toContain('Psalter')
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
    it('HspObjects', async () => {
      const { container } = await renderWithProviders(
        <HspObjects
          hspObject={hspMockObject}
          numOfDescriptions={1}
          numOfDigitizeds={1}
        />,
      )
      expect(container.textContent).toContain('Petrus Wagner')
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
    it('HspDescriptions', async () => {
      const { container } = await renderWithProviders(
        <HspDescriptions hspDescriptions={[descriptionMock]} />,
      )
      expect(container.textContent).toContain('Karin Schneider')
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
    it('HspDigitizeds', async () => {
      const { container } = await renderWithProviders(
        <HspDigitizeds hspDigitizeds={[digitizedMock]} />,
      )
      expect(container.textContent).toContain('Bayerische Staatsbibliothek')
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
    it('NormEntry', async () => {
      const { container } = await renderWithProviders(
        <NormEntry normEntry={{ value: 'NORM-123', id: '123' }} />,
      )
      expect(container.textContent).toContain('NORM-123')
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
  describe('ListView', function () {
    it('ListView', async () => {
      jest.mocked(useLoaderData).mockReturnValue({
        searchResult: { searchResult: mockHspObjectsByQuery },
      })

      const { container } = await renderWithProviders(<ListView />)
      expect(container.textContent).toContain('Psalter')
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
    it('Filters', async () => {
      const { container } = await renderWithProviders(<Filters />)
      expect(container.textContent).toContain('Filter')
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
    it('ActiveFilters', async () => {
      const { container } = await renderWithProviders(<ActiveFilters />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
    it('Tools', async () => {
      const { container } = await renderWithProviders(<Tools />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})
