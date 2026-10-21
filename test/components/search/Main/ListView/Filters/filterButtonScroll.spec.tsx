import { afterEach, beforeEach, describe, expect, test } from '@jest/globals'
import { act, screen, waitFor, within } from '@testing-library/react'
import { hspTheme } from 'hsp-web-module'
import { createMatchMedia, renderWithProviders } from 'test/testutils'

import { ScrollContainerContext } from 'src/components/navigation/mobile/ScrollContainerContext'
import { Filters } from 'src/components/search/Main/ListView/Filters'
import { initI18n } from 'src/contexts/i18n'

const xs = hspTheme.breakpoints?.values?.xs
const sm = hspTheme.breakpoints?.values?.sm

if (xs === undefined || sm === undefined) {
  throw new Error('Could not find breakpoint values')
}

// Stand-in for the element the mobile layout scrolls; the closed filter button
// reads its scroll source from this context.
const renderFilters = (scrollContainer: HTMLElement) =>
  renderWithProviders(
    <ScrollContainerContext.Provider value={scrollContainer}>
      <Filters />
    </ScrollContainerContext.Provider>,
  )

const scrollTo = (el: HTMLElement, top: number) =>
  act(() => {
    el.scrollTop = top
    el.dispatchEvent(new Event('scroll'))
  })

describe('mobile result-list filter button on scroll', () => {
  let scrollEl: HTMLDivElement

  beforeEach(async () => {
    await initI18n({ doNotTranslate: true })
    ;(window as any).matchMedia = createMatchMedia(xs + 1) // below the sm breakpoint
    scrollEl = document.createElement('div')
    document.body.appendChild(scrollEl)
  })

  afterEach(() => {
    scrollEl.remove()
  })

  // ------------------------------------------------------
  test('pins the closed filter button in a dedicated bar', async () => {
    await renderFilters(scrollEl)

    const bar = await screen.findByTestId('mobile-filter-bar')
    expect(within(bar).getByRole('button')).toBeTruthy()
  })

  // ------------------------------------------------------
  test('hides on scroll down and returns on scroll up', async () => {
    await renderFilters(scrollEl)
    const bar = await screen.findByTestId('mobile-filter-bar')

    // Visible at the top, hidden once scrolled down past the trigger threshold.
    expect(bar.style.visibility).toBe('')
    scrollTo(scrollEl, 300)
    await waitFor(() => expect(bar.style.visibility).toBe('hidden'))

    // Returns together with the header on scroll up (#24567).
    scrollTo(scrollEl, 0)
    await waitFor(() => expect(bar.style.visibility).toBe(''))
  })
})

describe('desktop result-list filter button', () => {
  beforeEach(async () => {
    await initI18n({ doNotTranslate: true })
    ;(window as any).matchMedia = createMatchMedia(sm) // at/above the sm breakpoint
  })

  // ------------------------------------------------------
  test('keeps its in-flow layout without the mobile scroll bar', async () => {
    await renderFilters(document.createElement('div'))

    // The filter button still renders ...
    expect(
      await screen.findByTestId('discovery-list-view-filters'),
    ).toBeTruthy()
    expect(screen.getByRole('button')).toBeTruthy()
    // ... but it is not wrapped in the mobile fixed/slide bar.
    expect(screen.queryByTestId('mobile-filter-bar')).toBeNull()
  })
})
