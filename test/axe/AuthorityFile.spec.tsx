import { expect } from '@jest/globals'
import { axe, toHaveNoViolations } from 'jest-axe'
import { useAsyncValue } from 'react-router'
import { authFileMock } from 'test/mocks/jestAxeMocks'

import { NormOverview } from 'src/components/authorityFiles'
import { Entity } from 'src/components/authorityFiles/Entities'
import { EntityType } from 'src/components/authorityFiles/Entities/AuthObject'
import { initI18n } from 'src/contexts/i18n'

import { renderWithProviders } from '../testutils'

expect.extend(toHaveNoViolations)

global.scrollTo = jest.fn()

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useAsyncValue: jest.fn(),
}))
jest.mock('src/contexts/modules', () => ({
  useModules: jest.fn(() => ({})),
}))

describe('Authority files accessibility', function () {
  initI18n({ doNotTranslate: true })
  it('NormOverview', async () => {
    jest.mocked(useAsyncValue).mockReturnValue({
      authItem: { ...authFileMock, preferredName: 'NormOverview Test' },
      numFound: 0,
    })
    const { container } = await renderWithProviders(<NormOverview />)
    expect(container.textContent).toContain('NormOverview Test')
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
  it('Entity', async () => {
    const { container } = await renderWithProviders(
      <Entity
        authItem={{ ...authFileMock, preferredName: 'Entity Test' }}
        numFound={2}
        entityType={'place' as EntityType}
      />,
    )
    expect(container.textContent).toContain('Entity Test')
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
