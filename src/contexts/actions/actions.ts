import { createAction } from 'src/utils'

import { State } from '../types'

export const actions = {
  setState: createAction<State>('SET_STATE'),
  toggleSidebar: createAction<void>('TOGGLE_SIDEBAR'),
  setWorkspaceBadgeCount: createAction<number>('SET_WORKSPACE_BADGE_COUNT'),
  setProjectStatus: createAction<State['projectStatus']>('SET_PROJECT_STATUS'),
  setIsMiradorMaximized: createAction<boolean>('SET_IS_MAXIMIZED'),
}
