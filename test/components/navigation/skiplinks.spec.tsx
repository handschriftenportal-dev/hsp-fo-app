import { test } from '@jest/globals'
import { act, render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router'

import { SkipLink } from 'src/components/navigation/shared/SkipLink'
import { initI18n } from 'src/contexts/i18n'

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () =>
    jest.fn().mockImplementation(() => Promise.resolve({ title: 'test' })),
}))

function renderSkiplinks(searchParam: string) {
  initI18n({ doNotTranslate: true })
  render(
    <MemoryRouter initialEntries={[searchParam]}>
      <SkipLink />
    </MemoryRouter>,
  )
}

test('test if skiplinks for home exist', function () {
  act(() => {
    renderSkiplinks('')
  })
  screen.getByText('skiplinks.searchBarSelect')
  screen.getByText('skiplinks.sideBarMenu')
  screen.getByText('skiplinks.languageSwitch')
  screen.getByText('skiplinks.accessibility')
  screen.getByText('skiplinks.gallery')
})

test('test if skiplinks for search exist', function () {
  act(() => {
    renderSkiplinks('/search')
  })
  screen.getByText('skiplinks.searchHit')
  screen.getByText('skiplinks.pageNav')
  screen.getByText('skiplinks.filterOptions')
  screen.getByText('skiplinks.searchBarSelect')

  act(() => {
    renderSkiplinks('hspobjectid')
  })
  screen.getByText('skiplinks.content')
  screen.getByText('skiplinks.hsp-descriptions')
  screen.getByText('skiplinks.hsp-digitizeds')
  screen.getByText('skiplinks.resultNav')
})

test('test if skiplinks for projects exist', function () {
  act(() => {
    renderSkiplinks('/projects')
  })
  screen.getByText('skiplinks.flipcard')
  screen.getByText('skiplinks.searchBarSelect')
})
