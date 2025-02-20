import { expect } from '@jest/globals'
import { axe, toHaveNoViolations } from 'jest-axe'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { hspMockObject } from 'test/mocks/hspMockObjects'
import {
  descriptionMock,
  digitizedMock,
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
import * as useHspObjectsByQuery from 'src/contexts/discovery/useHspObjectsByQuery'
import { initI18n } from 'src/contexts/i18n'

import '../testutils'
import { renderWithProviders } from '../testutils/renderWithProviders'

global.scrollTo = jest.fn()

jest.mock('src/contexts/modules', () => ({
  useModules: jest.fn(() => ({})),
}))

jest
  .spyOn(useHspObjectsByQuery, 'useHspObjectsByQuery')
  .mockReturnValue({ data: mockHspObjectsByQuery } as any)

expect.extend(toHaveNoViolations)

describe('Extended Search accessibility', function () {
  initI18n({ doNotTranslate: true })

  it('Extended search view', async () => {
    let container
    let results
    await act(async () => {
      const renderResult = renderWithProviders(<ExtendedSearchView />)
      container = renderResult.container
      results = await axe(container)
    })

    expect(results).toHaveNoViolations()
  })
})

describe('Search accessibility', function () {
  initI18n({ doNotTranslate: true })
  describe('Overview', function () {
    it('index', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {})

      let container
      let results
      await act(async () => {
        const renderResult = renderWithProviders(<Overview />)
        container = renderResult.container
        results = await axe(container)
      })

      expect(results).toHaveNoViolations()
    })
    it('HspObjects', async () => {
      let container
      let results
      await act(async () => {
        const renderResult = renderWithProviders(
          <HspObjects
            hspObject={hspMockObject}
            numOfDescriptions={1}
            numOfDigitizeds={1}
          />,
        )
        container = renderResult.container
        results = await axe(container)
      })

      expect(results).toHaveNoViolations()
    })
    it('HspDescriptions', async () => {
      let container
      let results
      await act(async () => {
        const renderResult = renderWithProviders(
          <HspDescriptions hspDescriptions={[descriptionMock]} />,
        )
        container = renderResult.container
        results = await axe(container)
      })

      expect(results).toHaveNoViolations()
    })
    it('HspDigitizeds', async () => {
      let container
      let results
      await act(async () => {
        const renderResult = renderWithProviders(
          <HspDigitizeds hspDigitizeds={[digitizedMock]} />,
        )
        container = renderResult.container
        results = await axe(container)
      })

      expect(results).toHaveNoViolations()
    })
    it('Authorithy file kod table', async () => {
      let container
      let results
      await act(async () => {
        const renderResult = renderWithProviders(
          <NormEntry normEntry={{ value: 'NORM-123', id: '123' }} />,
        )
        container = renderResult.container
        results = await axe(container)
      })

      expect(results).toHaveNoViolations()
    })
  })
  describe('ListView', function () {
    it('index', async () => {
      let container
      let results
      await act(async () => {
        const renderResult = renderWithProviders(<ListView />)
        container = renderResult.container
        results = await axe(container)
      })

      expect(results).toHaveNoViolations()
    })
    it('Filters', async () => {
      let container
      let results
      await act(async () => {
        const renderResult = renderWithProviders(<Filters />)
        container = renderResult.container
        results = await axe(container)
      })

      expect(results).toHaveNoViolations()
    })
    it('Active Filters', async () => {
      let container
      let results
      await act(async () => {
        const renderResult = renderWithProviders(<ActiveFilters />)
        container = renderResult.container
        results = await axe(container)
      })

      expect(results).toHaveNoViolations()
    })
    it('Tools', async () => {
      let container
      let results
      await act(async () => {
        const renderResult = renderWithProviders(<Tools />)
        container = renderResult.container
        results = await axe(container)
      })

      expect(results).toHaveNoViolations()
    })
  })
})
