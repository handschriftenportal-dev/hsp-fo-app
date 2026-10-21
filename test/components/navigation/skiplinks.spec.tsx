import { test } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'

import { SkipLink } from 'src/components/navigation/shared/SkipLink'
import { initI18n } from 'src/contexts/i18n'

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () =>
    jest.fn().mockImplementation(() => Promise.resolve({ title: 'test' })),
}))

initI18n({ doNotTranslate: true })

function renderSkiplinks(searchParam: string) {
  render(
    <MemoryRouter initialEntries={[searchParam]}>
      <SkipLink />
    </MemoryRouter>,
  )
}

test('if skiplinks for home exist', function () {
  renderSkiplinks('')
  expect(screen.getByText('skiplinks.searchBarSelect')).toBeTruthy()
  expect(screen.getByText('skiplinks.sideBarMenu')).toBeTruthy()
  expect(screen.getByText('skiplinks.languageSwitch')).toBeTruthy()
  expect(screen.getByText('skiplinks.accessibility')).toBeTruthy()
  expect(screen.getByText('skiplinks.gallery')).toBeTruthy()
})

test('if skiplinks for search exist', function () {
  renderSkiplinks('/search')
  expect(screen.getByText('skiplinks.searchHit')).toBeTruthy()
  expect(screen.getByText('skiplinks.pageNav')).toBeTruthy()
  expect(screen.getByText('skiplinks.filterOptions')).toBeTruthy()
  expect(screen.getByText('skiplinks.searchBarSelect')).toBeTruthy()

  renderSkiplinks('/search?hspobjectid=HSP-123')
  expect(screen.getByText('skiplinks.content')).toBeTruthy()
  expect(screen.getByText('skiplinks.hsp-descriptions')).toBeTruthy()
  expect(screen.getByText('skiplinks.hsp-digitizeds')).toBeTruthy()
  expect(screen.getByText('skiplinks.resultNav')).toBeTruthy()
})

test('if skiplinks for projects exist', function () {
  renderSkiplinks('/projects')
  expect(screen.getByText('skiplinks.flipcard')).toBeTruthy()
  expect(screen.getByText('skiplinks.searchBarSelect')).toBeTruthy()
})
