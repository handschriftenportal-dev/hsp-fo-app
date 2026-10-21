import { LogicOperator } from 'src/components/search/config'
import { createAction } from 'src/utils'
import {
  ExtendedFieldsInfo,
  FilterQuery,
  ParsedSearchParams,
} from 'src/utils/searchparams'

import {
  GroupedExtendedSearchState,
  HitListVariantType,
  HitOpenActionType,
  SearchListProps,
  SearchState,
} from '../types'

export const searchActions = {
  setModifiedFilterQuery: createAction<FilterQuery | undefined>(
    'SET_MODIFIED_SEARCH_FILTER_QUERY',
  ),
  setHitListVariant: createAction<HitListVariantType>('SET_HIT_LIST_VARIANT'),
  setHitOpen: createAction<HitOpenActionType>('SET_HIT_OPEN'),
  deleteAllHits: createAction('DELETE_ALL_HITS'),
  setSelectedResources: createAction<SearchState['selectedResources']>(
    'SET_SELECTED_RESOURCES',
  ),
  setSearchTerm: createAction<string>('SET_SEARCH_TERM'),
  setSearchField: createAction<string>('SET_SEARCH_FIELD'),
  setSearchParams: createAction<ParsedSearchParams>('SET_SEARCH_PARAMS'),
  setExtSearchList: createAction<
    GroupedExtendedSearchState['extendedSearchGroups']
  >('SET_EXT_SEARCH_LIST'),
  addToExtSearchList: createAction<{
    index: number
    groupId: string
    logicOperator: LogicOperator
    extFieldInfo: ExtendedFieldsInfo[]
  }>('ADD_TO_EXT_SEARCH_LIST'),

  removeFromExtSearchList: createAction<{ index: number; groupId: string }>(
    'REMOVE_FROM_EXT_SEARCH_LIST',
  ),
  setNewExtSearchValue: createAction<{
    index: number
    groupId: string
    value: string
    property: keyof SearchListProps
  }>('SET_NEW_EXT_SEARCH_TERM'),
  setNewOrderExtSearch: createAction<{ startIndex: number; endIndex: number }>(
    'SET_NEW_ORDER_EXT_SEARCH',
  ),
  setExtSearchFieldsInfo: createAction<ExtendedFieldsInfo[]>(
    'SET_EXT_SEARCH_FIELDS',
  ),
  setHasFetchedExtFieldInfo: createAction<boolean>(
    'SET_HAS_FETCHED_EXT_FIELD_INFO',
  ),
  setAuthorityId: createAction<string>('SET_AUTHORITY_ID'),
  setShowFilterList: createAction<boolean>('SET_SHOW_FILTER_LIST'),
}
