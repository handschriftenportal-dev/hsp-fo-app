import { createReducer } from '@reduxjs/toolkit'

import { actions } from '../actions/actions'
import { State } from '../types'

export const appState: State = {
  sidebarOpen: false,
  workspaceBadgeCount: 0,
  isMiradorMaximized: false,
  projectStatus: 'running',
}

export const appReducer = createReducer<State>(appState, (builder) => {
  builder.addCase(actions.setState, (state, action) => {
    return action.payload
  })
  builder.addCase(actions.toggleSidebar, (state) => {
    state.sidebarOpen = !state.sidebarOpen
  })
  builder.addCase(actions.setWorkspaceBadgeCount, (state, action) => {
    state.workspaceBadgeCount = action.payload
  })
  builder.addCase(actions.setProjectStatus, (state, action) => {
    state.projectStatus = action.payload
  })
  builder.addCase(actions.setIsMiradorMaximized, (state, action) => {
    state.isMiradorMaximized = action.payload
  })
})
