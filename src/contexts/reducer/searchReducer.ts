import { createReducer } from '@reduxjs/toolkit'

import { searchActions } from '../actions/searchActions'
import { SearchState } from '../types'

export const searchState: SearchState = {
  authorityId: '',
  listView: {
    hitListVariant: 'expanded',
    hits: {},
  },
  searchField: 'FIELD-GROUP-ALL',
  searchTerm: '',
  searchParams: {},
  selectedResources: [],
  showFilterList: false,
}

export const searchReducer = createReducer<SearchState>(
  searchState,
  (builder) => {
    builder.addCase(searchActions.setModifiedFilterQuery, (state, action) => {
      state.modifiedFilterQuery = action.payload
    })

    builder.addCase(searchActions.setHitListVariant, (state, action) => {
      state.listView.hitListVariant = action.payload
    })

    builder.addCase(searchActions.setHitOpen, (state, action) => {
      const { id, open, citationOpen } = action.payload
      if (!state.listView.hits[id]) {
        state.listView.hits[id] = {}
      }
      state.listView.hits[id].open = open ?? state.listView.hits[id].open
      state.listView.hits[id].citationOpen =
        citationOpen ?? state.listView.hits[id].citationOpen
    })

    builder.addCase(searchActions.deleteAllHits, (state) => {
      state.listView.hits = {}
    })

    builder.addCase(searchActions.setSelectedResources, (state, action) => {
      state.selectedResources = action.payload
    })

    builder.addCase(searchActions.setSearchTerm, (state, action) => {
      state.searchTerm = action.payload
    })

    builder.addCase(searchActions.setSearchField, (state, action) => {
      state.searchField = action.payload
    })

    builder.addCase(searchActions.setSearchParams, (state, action) => {
      state.searchParams = action.payload
    })

    builder.addCase(searchActions.setShowFilterList, (state, action) => {
      state.showFilterList = action.payload
    })

    builder.addCase(searchActions.setAuthorityId, (state, action) => {
      state.authorityId = action.payload
    })
  },
)
