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

// because cypress shadows some jest globals by mocha/chai globals
import { expect, test } from '@jest/globals'
import { makeStore, actions, selectors } from 'src/contexts/state'

test('setState', function () {
  const store = makeStore()
  expect(store.getState()).toEqual({
    sidebarOpen: false,
    workspaceBadgeCount: 0,
    showFeedbackButton: true,
  })
  store.dispatch(
    actions.setState({
      sidebarOpen: true,
      workspaceBadgeCount: 64,
      showFeedbackButton: false,
    })
  )
  expect(store.getState()).toEqual({
    sidebarOpen: true,
    workspaceBadgeCount: 64,
    showFeedbackButton: false,
  })
})

test('sideBarOpen', function () {
  const store = makeStore()
  expect(selectors.getSidebarOpen(store.getState())).toBe(false)
  store.dispatch(actions.toggleSidebar())
  expect(selectors.getSidebarOpen(store.getState())).toBe(true)
  store.dispatch(actions.toggleSidebar())
  expect(selectors.getSidebarOpen(store.getState())).toBe(false)
})

test('workspaceBadgeCount', function () {
  const store = makeStore()
  expect(selectors.getWorkspaceBadgeCount(store.getState())).toBe(0)
  store.dispatch(actions.setWorkspaceBadgeCount(3))
  expect(selectors.getWorkspaceBadgeCount(store.getState())).toBe(3)
})

test('showFeedback', function () {
  const store = makeStore()
  expect(selectors.getShowFeedbackButton(store.getState())).toBe(true)
  store.dispatch(actions.setShowFeedbackButton(false))
  expect(selectors.getShowFeedbackButton(store.getState())).toBe(false)
})
