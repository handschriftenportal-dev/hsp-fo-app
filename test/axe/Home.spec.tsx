import { expect } from '@jest/globals'
import { axe, toHaveNoViolations } from 'jest-axe'
import { homeMock } from 'test/mocks/jestAxeMocks'
import 'test/testutils/mockEmblaCarousel'

import { Home } from 'src/components/home'
import { Carousel } from 'src/components/home/Carousel'
import { initI18n } from 'src/contexts/i18n'

import { renderWithProviders } from '../testutils'

expect.extend(toHaveNoViolations)

describe('Home accessibility', function () {
  initI18n({ doNotTranslate: true })

  it('Home', async () => {
    const { container } = await renderWithProviders(<Home />, homeMock)
    expect(container.textContent).toContain('infoImg')
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
  it('Carousel', async () => {
    const { container } = await renderWithProviders(<Carousel />, homeMock)
    expect(container.textContent).toContain('exampleImg')
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
