import { createReducer } from '@reduxjs/toolkit'

import { catalogActions } from '../actions/catalogActions'
import { CatalogState } from '../types'

export const catalogState: CatalogState = {
  notificationOpen: true,
  searchTerm: '',
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
    builder.addCase(catalogActions.setSearchTerm, (state, action) => {
      state.searchTerm = action.payload
    })
  },
)
