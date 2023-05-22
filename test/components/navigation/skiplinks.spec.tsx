/*
 * MIT License
 *
 * Copyright (c) 2023 Staatsbibliothek zu Berlin - Preußischer Kulturbesitz
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import { test } from '@jest/globals'
import React from 'react'
import { screen, render } from '@testing-library/react'
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
    </MemoryRouter>
  )
}

test('test if skiplinks for home exist', function () {
  renderSkiplinks('')
  screen.getByText('skiplinks.searchBarSelect')
  screen.getByText('skiplinks.sideBarMenu')
  screen.getByText('skiplinks.languageSwitch')
  screen.getByText('skiplinks.accessibility')
  screen.getByText('skiplinks.gallery')
})

test('test if skiplinks for search exist', function () {
  renderSkiplinks('/search')
  screen.getByText('skiplinks.searchHit')
  screen.getByText('skiplinks.pageNav')
  screen.getByText('skiplinks.filterOptions')
  screen.getByText('skiplinks.searchBarSelect')

  renderSkiplinks('hspobjectid')
  screen.getByText('skiplinks.content')
  screen.getByText('skiplinks.hsp-descriptions')
  screen.getByText('skiplinks.hsp-digitizeds')
  screen.getByText('skiplinks.resultNav')
})

test('test if skiplinks for projects exist', function () {
  renderSkiplinks('/projects')
  screen.getByText('skiplinks.content')
  screen.getByText('skiplinks.searchBarSelect')
})
