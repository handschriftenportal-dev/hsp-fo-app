import { Dispatch } from 'react'

import { searchActions } from 'src/contexts/actions/searchActions'
import { ExtendedFieldsInfo } from 'src/utils/searchparams'

import { ComparisonOperator } from '../../config'

export const resetSearchEntry = (
  index: number,
  searchTermValue: string,
  dispatch: Dispatch<unknown>,
  groupId: string,
  extFieldInfo: ExtendedFieldsInfo[],
  type?: string,
) => {
  dispatch(
    searchActions.setNewExtSearchValue({
      index,
      value: ComparisonOperator.EQ,
      groupId,
      property: 'comparisonOperator',
    }),
  )
  if (type === 'ENUM') {
    const defaultTerm = (
      extFieldInfo.find((entry) => entry.name === searchTermValue) as {
        values: string[]
      }
    ).values[0]
    dispatch(
      searchActions.setNewExtSearchValue({
        index,
        value: defaultTerm,
        groupId,
        property: 'searchTerm',
      }),
    )
  } else {
    dispatch(
      searchActions.setNewExtSearchValue({
        index,
        value: searchTermValue,
        groupId,
        property: 'searchTerm',
      }),
    )
  }
}
