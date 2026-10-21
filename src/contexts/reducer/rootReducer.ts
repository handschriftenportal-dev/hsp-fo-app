import { combineReducers } from '@reduxjs/toolkit'

import {
  CatalogState,
  GroupedExtendedSearchState,
  SearchState,
  State,
} from '../types'
import { appReducer } from './appReducer'
import { catalogReducer } from './catalogReducer'
import { extSearchReducer } from './extSearchReducer'
import { searchReducer } from './searchReducer'

export interface CombinedState {
  app: State
  catalogs: CatalogState
  search: SearchState
  extSearch: GroupedExtendedSearchState
}

export const rootReducer = combineReducers<any>({
  app: appReducer,
  catalogs: catalogReducer,
  search: searchReducer,
  extendedSearch: extSearchReducer,
})
