import { createReducer } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

import {
  ComparisonOperator,
  searchBarOptions,
} from 'src/components/search/config'
import { searchActions } from 'src/contexts/actions/searchActions'

import {
  GroupedExtendedSearchState,
  SearchGroup,
  SearchListProps,
} from '../types'
import { extFieldGroups } from './extFieldGroups'
import {
  addElement,
  deleteElement,
  removeEmptyElements,
  updateElement,
} from './modifyElements'

export const defaultExtendedSearchListItem: SearchListProps = {
  searchField: searchBarOptions[0],
  comparisonOperator: ComparisonOperator.EQ,
  searchTerm: '',
  id: uuidv4(),
}

export const defaultSearchGroupItem: SearchGroup = {
  groupId: 'base',
  groupLogicOperators: [],
  elements: [defaultExtendedSearchListItem],
}

export const groupedExtendedSearchItem: GroupedExtendedSearchState = {
  extendedSearchGroups: [defaultSearchGroupItem],
  extendedFieldsInfo: extFieldGroups,
  hasFetchedExtFields: false,
}

export const extSearchReducer = createReducer<GroupedExtendedSearchState>(
  groupedExtendedSearchItem,
  (builder) => {
    builder.addCase(searchActions.setExtSearchList, (state, action) => {
      state.extendedSearchGroups = action.payload
    })
    builder.addCase(searchActions.removeFromExtSearchList, (state, action) => {
      const { index, groupId } = action.payload

      const newState = deleteElement(state.extendedSearchGroups, groupId, index)

      removeEmptyElements(newState)

      state.extendedSearchGroups = newState
    })
    builder.addCase(searchActions.setNewExtSearchValue, (state, action) => {
      const { index, groupId, value, property } = action.payload

      const newState = updateElement(
        state.extendedSearchGroups,
        groupId,
        index,
        value,
        property,
      )

      state.extendedSearchGroups = newState
    })

    builder.addCase(searchActions.addToExtSearchList, (state, action) => {
      const { index, logicOperator, groupId, extFieldInfo } = action.payload

      const newState = addElement(
        state.extendedSearchGroups,
        groupId,
        index,
        logicOperator,
        extFieldInfo,
      )

      state.extendedSearchGroups = newState
    })

    builder.addCase(searchActions.setExtSearchFieldsInfo, (state, action) => {
      state.extendedFieldsInfo = action.payload
    })

    builder.addCase(
      searchActions.setHasFetchedExtFieldInfo,
      (state, action) => {
        state.hasFetchedExtFields = action.payload
      },
    )
  },
)
