import { createReducer } from '@reduxjs/toolkit'

import { catalogActions } from '../actions/catalogActions'
import { CatalogState } from '../types'

export const catalogState: CatalogState = {
  notificationOpen: true,
}

export const catalogReducer = createReducer<CatalogState>(
  catalogState,
  (builder) => {
    builder.addCase(catalogActions.setModifiedFilterQuery, (state, action) => {
      state.modifiedFilterQuery = action.payload
    })
    builder.addCase(catalogActions.toggleNotification, (state) => {
      state.notificationOpen = false
    })
  },
)
