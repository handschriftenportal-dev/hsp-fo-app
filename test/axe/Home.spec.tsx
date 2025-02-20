import { expect } from '@jest/globals'
import { axe, toHaveNoViolations } from 'jest-axe'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { homeMock } from 'test/mocks/jestAxeMocks'

import { Home } from 'src/components/home'
import { Carousel } from 'src/components/home/Carousel'
import { initI18n } from 'src/contexts/i18n'

import '../testutils'
import { renderWithProviders } from '../testutils/renderWithProviders'

expect.extend(toHaveNoViolations)

describe('Home accessibility', function () {
  initI18n({ doNotTranslate: true })

  it('Home', async () => {
    let container
    let results
    await act(async () => {
      const renderResult = renderWithProviders(<Home />, homeMock)
      container = renderResult.container
      results = await axe(container)
    })

    expect(results).toHaveNoViolations()
  })
  it('Carousel', async () => {
    let container
    let results
    await act(async () => {
      const renderResult = renderWithProviders(<Carousel />, homeMock)
      container = renderResult.container
      results = await axe(container)
    })

    expect(results).toHaveNoViolations()
  })
})
