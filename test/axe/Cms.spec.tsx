import { expect } from '@jest/globals'
import { axe, toHaveNoViolations } from 'jest-axe'
import { cmsMock } from 'test/mocks/jestAxeMocks'

import { Cms } from 'src/components/cms'
import { initI18n } from 'src/contexts/i18n'

import { renderWithProviders } from '../testutils'

expect.extend(toHaveNoViolations)

describe('Cms accessibility', function () {
  initI18n({ doNotTranslate: true })

  it('CMS', async () => {
    const { container } = await renderWithProviders(<Cms />, cmsMock)
    // Cms renders content into a shadow root, so textContent is not
    // reachable from the light DOM. Assert on the host element instead.
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector('#page-shadow-container')).toBeTruthy()
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
