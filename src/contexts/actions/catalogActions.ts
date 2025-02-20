import { createAction } from 'src/utils'
import { FilterQuery } from 'src/utils/searchparams'

export const catalogActions = {
  setModifiedFilterQuery: createAction<FilterQuery | undefined>(
    'SET_MODIFIED_CATALOG_FILTER_QUERY',
  ),
  toggleNotification: createAction('TOGGLE_CATALOG_NOTIFICATION'),
}
