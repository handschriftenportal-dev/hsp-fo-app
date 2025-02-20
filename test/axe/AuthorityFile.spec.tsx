import { expect } from '@jest/globals'
import { axe, toHaveNoViolations } from 'jest-axe'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { authFileMock } from 'test/mocks/jestAxeMocks'

import { NormOverview } from 'src/components/authorityFiles'
import { Entity } from 'src/components/authorityFiles/Entities'
import { EntityType } from 'src/components/authorityFiles/Entities/AuthObject'
import { initI18n } from 'src/contexts/i18n'

import '../testutils'
import { renderWithProviders } from '../testutils/renderWithProviders'

expect.extend(toHaveNoViolations)

global.scrollTo = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLoaderData: jest.fn(),
}))
jest.mock('src/contexts/modules', () => ({
  useModules: jest.fn(() => ({})),
}))

describe('Authority files accessibility', function () {
  initI18n({ doNotTranslate: true })
  it('index', async () => {
    let container
    let results

    require('react-router-dom').useLoaderData.mockReturnValue({
      authItem: authFileMock,
      numFound: 0,
    })

    await act(async () => {
      const renderResult = renderWithProviders(<NormOverview />)
      container = renderResult.container
      results = await axe(container)
    })

    expect(results).toHaveNoViolations()
  })
  it('Norm object', async () => {
    let container
    let results
    await act(async () => {
      const renderResult = renderWithProviders(
        <Entity
          authItem={authFileMock}
          numFound={2}
          entityType={'place' as EntityType}
        />,
      )
      container = renderResult.container
      results = await axe(container)
    })

    expect(results).toHaveNoViolations()
  })
})
