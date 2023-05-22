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

import { createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createAction, isType, AnyAction } from 'src/utils/stateUtils'

export { useDispatch, useSelector } from 'react-redux'

export interface State {
  sidebarOpen: boolean
  workspaceBadgeCount: number
  showFeedbackButton: boolean
}

export const actions = {
  setState: createAction<State>('SET_STATE'),
  toggleSidebar: createAction<void>('TOGGLE_SIDEBAR'),
  setWorkspaceBadgeCount: createAction<number>('SET_WORKSPACE_BADGE_COUNT'),
  setShowFeedbackButton: createAction<boolean>('SET_SHOW_FEEDBACK_BUTTON'),
}

export const selectors = {
  getSidebarOpen: (state: State) => state.sidebarOpen,
  getWorkspaceBadgeCount: (state: State) => state.workspaceBadgeCount,
  getShowFeedbackButton: (state: State) => state.showFeedbackButton,
}

export const defaultState: State = {
  sidebarOpen: false,
  workspaceBadgeCount: 0,
  showFeedbackButton: true,
}

export function reducer(state = defaultState, action: AnyAction): State {
  if (isType(action, actions.setState)) {
    return action.payload
  }

  if (isType(action, actions.toggleSidebar)) {
    return { ...state, sidebarOpen: !state.sidebarOpen }
  }

  if (isType(action, actions.setWorkspaceBadgeCount)) {
    return { ...state, workspaceBadgeCount: action.payload }
  }

  if (isType(action, actions.setShowFeedbackButton)) {
    return { ...state, showFeedbackButton: action.payload }
  }

  return state
}

export const makeStore = (initialState?: State) =>
  createStore(reducer, initialState, composeWithDevTools())
