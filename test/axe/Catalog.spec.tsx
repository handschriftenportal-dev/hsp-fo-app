import { expect } from '@jest/globals'
import { axe, toHaveNoViolations } from 'jest-axe'
import { useLoaderData } from 'react-router'
import { catalogsMock } from 'test/mocks/jestAxeMocks'

import { CatalogFilters } from 'src/components/catalogs/Filters'
import { View } from 'src/components/shared'
import { initI18n } from 'src/contexts/i18n'

import { renderWithProviders } from '../testutils'

expect.extend(toHaveNoViolations)

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLoaderData: jest.fn(),
}))
jest.mock('src/contexts/modules', () => ({
  useModules: jest.fn(() => ({})),
}))

describe('Catalog accessibility', function () {
  initI18n({ doNotTranslate: true })

  it('Catalog view', async () => {
    jest.mocked(useLoaderData).mockReturnValue({
      searchResult: { searchResult: catalogsMock },
    })

    const { container } = await renderWithProviders(
      <View FiltersComponent={<CatalogFilters />} Fallback={<></>} />,
    )
    expect(container.textContent).toContain('Regina Hausmann')
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
