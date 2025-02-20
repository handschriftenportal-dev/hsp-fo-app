import { expect } from '@jest/globals'
import { axe, toHaveNoViolations } from 'jest-axe'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { cmsMock } from 'test/mocks/jestAxeMocks'

import { Cms } from 'src/components/cms'
import { initI18n } from 'src/contexts/i18n'

import '../testutils'
import { renderWithProviders } from '../testutils/renderWithProviders'

expect.extend(toHaveNoViolations)

describe('Cms accessibility', function () {
  initI18n({ doNotTranslate: true })

  it('CMS', async () => {
    let container
    let results
    await act(async () => {
      const renderResult = renderWithProviders(<Cms />, cmsMock)
      container = renderResult.container
      results = await axe(container)
    })

    expect(results).toHaveNoViolations()
  })
})
