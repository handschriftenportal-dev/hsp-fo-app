import { expect, test } from '@jest/globals'
import { Action } from '@reduxjs/toolkit'
import { makeStore } from 'test/testutils/makeStore'

import { actions } from 'src/contexts/actions/actions'
import { selectors } from 'src/contexts/selectors'

test('setState', function () {
  const store = makeStore()
  expect(store.getState().app).toEqual({
    sidebarOpen: false,
    workspaceBadgeCount: 0,
    isMiradorMaximized: false,
    projectStatus: 'running',
  })
  store.dispatch(
    actions.setState({
      sidebarOpen: true,
      workspaceBadgeCount: 64,
      projectStatus: 'running',
    }) as Action,
  )

  expect(store.getState().app).toEqual({
    sidebarOpen: true,
    workspaceBadgeCount: 64,
    projectStatus: 'running',
  })
})

test('sideBarOpen', function () {
  const store = makeStore()
  expect(selectors.getSidebarOpen(store.getState())).toBe(false)
  store.dispatch(actions.toggleSidebar() as Action)
  expect(selectors.getSidebarOpen(store.getState())).toBe(true)
  store.dispatch(actions.toggleSidebar() as Action)
  expect(selectors.getSidebarOpen(store.getState())).toBe(false)
})

test('workspaceBadgeCount', function () {
  const store = makeStore()
  expect(selectors.getWorkspaceBadgeCount(store.getState())).toBe(0)
  store.dispatch(actions.setWorkspaceBadgeCount(3) as Action)
  expect(selectors.getWorkspaceBadgeCount(store.getState())).toBe(3)
})
