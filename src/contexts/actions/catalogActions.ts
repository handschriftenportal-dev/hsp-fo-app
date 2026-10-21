import { createAction } from 'src/utils'
import { FilterQuery } from 'src/utils/searchparams'

export const catalogActions = {
  setModifiedFilterQuery: createAction<FilterQuery | undefined>(
    'SET_MODIFIED_CATALOG_FILTER_QUERY',
  ),
  setSearchTerm: createAction<string>('SET_CATALOG_SEARCH_TERM'),
  toggleNotification: createAction('TOGGLE_CATALOG_NOTIFICATION'),
}
