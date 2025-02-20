import { expect } from '@jest/globals'
import { axe, toHaveNoViolations } from 'jest-axe'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { catalogsMock } from 'test/mocks/jestAxeMocks'

import { CatalogFilters } from 'src/components/catalogs/Filters'
import { View } from 'src/components/shared'
import { initI18n } from 'src/contexts/i18n'

import '../testutils'
import { renderWithProviders } from '../testutils/renderWithProviders'

expect.extend(toHaveNoViolations)

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLoaderData: jest.fn(),
}))
jest.mock('src/contexts/modules', () => ({
  useModules: jest.fn(() => ({})),
}))

describe('Catalog accessibility', function () {
  initI18n({ doNotTranslate: true })

  it('Catalog view', async () => {
    let container
    let results

    require('react-router-dom').useLoaderData.mockReturnValue({
      searchResult: catalogsMock,
    })

    await act(async () => {
      const renderResult = renderWithProviders(
        <View FiltersComponent={<CatalogFilters />} />,
      )
      container = renderResult.container
      results = await axe(container)
    })

    expect(results).toHaveNoViolations()
  })
})
