/*
 * MIT License
 *
 * Copyright (c) 2021 Staatsbibliothek zu Berlin - Preußischer Kulturbesitz
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
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

// because cypress shadows some jest globals by mocha/chai globals
import { expect, test } from '@jest/globals'
import { AnyWebModule } from 'hsp-web-module'
import './mocks'
import { setup } from '../src/setup'
import { startRouting } from 'src/route'
import { renderHomePage } from 'src/pages/home'
import { renderSearchPage } from 'src/pages/search'
import { renderWorkspacePage } from 'src/pages/workspace'
import { renderCmsPage } from 'src/pages/cms'

jest.mock('src/pages/home')
jest.mock('src/pages/search')
jest.mock('src/pages/workspace')
jest.mock('src/pages/cms')


function dispatchLinkEventOfModule(m: AnyWebModule) {
  const url = m.getConfig().createAbsoluteURL({
    path: '/foo',
    params: new URLSearchParams(),
    hash: '#bar'
  })
  const event = new CustomEvent('linkClicked', {
    detail: url,
    cancelable: true,
  })
  m.eventTarget.dispatchEvent(event)
}


function resetPageMocks() {
  (renderHomePage as jest.Mock).mockReset();
  (renderSearchPage as jest.Mock).mockReset();
  (renderWorkspacePage as jest.Mock).mockReset();
  (renderCmsPage as jest.Mock).mockReset()
}

test('renders the home page by default', async function() {
  resetPageMocks()
  const context = await setup()
  startRouting(context)
  expect(renderHomePage).toHaveBeenCalled()
})

test('if hsp-home fires "linkClicked"', async function() {
  resetPageMocks()
  const context = await setup()
  startRouting(context)
  dispatchLinkEventOfModule(context.modules.home)
  // two times because the home page was already rendered by default
  expect(renderHomePage).toHaveBeenCalledTimes(2)
  expect(window.location.href).toBe('http://localhost/foo#bar')
})

test('if hsp-search fires "linkClicked"', async function() {
  resetPageMocks()
  const context = await setup()
  startRouting(context)
  dispatchLinkEventOfModule(context.modules.search)
  expect(renderSearchPage).toHaveBeenCalledTimes(1)
  expect(window.location.href).toBe('http://localhost/search/foo#bar')
})

test('if hsp-workspace fires "linkClicked"', async function() {
  resetPageMocks()
  const context = await setup()
  startRouting(context)
  dispatchLinkEventOfModule(context.modules.workspace)
  expect(renderWorkspacePage).toHaveBeenCalledTimes(1)
  expect(window.location.href).toBe('http://localhost/workspace/foo#bar')
})

test('if hsp-cms fires "linkClicked"', async function() {
  resetPageMocks()
  const context = await setup()
  startRouting(context)
  dispatchLinkEventOfModule(context.modules.cms)
  expect(renderCmsPage).toHaveBeenCalledTimes(1)
  expect(window.location.href).toBe('http://localhost/cms/foo#bar')
})




