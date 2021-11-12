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
import './mocks'
import { setup } from '../src/setup'


test('context contains all modules', async function() {
  const context = await setup()
  const { navigation, home, search, workspace, cms } = context.modules
  expect(navigation.getConfig().classNamePrefix).toBe('hsp-navigation')
  expect(home.getConfig().classNamePrefix).toBe('hsp-home')
  expect(search.getConfig().classNamePrefix).toBe('hsp-search')
  expect(workspace.getConfig().classNamePrefix).toBe('hsp-workspace')
  expect(cms.getConfig().classNamePrefix).toBe('hsp-cms')
})

test('context contains correct routing table', async function() {
  const context = await setup()
  expect(typeof context.routingTable['/']).toBe('function')
  expect(typeof context.routingTable['/search']).toBe('function')
  expect(typeof context.routingTable['/workspace']).toBe('function')
  expect(typeof context.routingTable['/cms']).toBe('function')
  // not more then the 4 above routes.
  expect(Object.keys(context.routingTable).length).toBe(4)
})

test('context contains correct feature flags', async function() {
  const context = await setup()
  expect(context.featureFlags).toEqual({
    cms: true
  })
})

test('context contains correct app container element', async function() {
  const context = await setup()
  expect(context.appContainer.id).toBe('app')
})

test('createAbsoluteURL callbacks work correct', async function() {
  const context = await setup()
  const { navigation, home, search, workspace, cms } = context.modules
  const location = {
    path: '/foo',
    params: new URLSearchParams('q=bar'),
    hash: '#baz'
  }
  expect(navigation.getConfig().createAbsoluteURL(location).href).toBe('http://localhost/foo?q=bar#baz')
  expect(home.getConfig().createAbsoluteURL(location).href).toBe('http://localhost/foo?q=bar#baz')
  expect(search.getConfig().createAbsoluteURL(location).href).toBe('http://localhost/search/foo?q=bar#baz')
  expect(workspace.getConfig().createAbsoluteURL(location).href).toBe('http://localhost/workspace/foo?q=bar#baz')
  expect(cms.getConfig().createAbsoluteURL(location).href).toBe('http://localhost/cms/foo?q=bar#baz')
})

