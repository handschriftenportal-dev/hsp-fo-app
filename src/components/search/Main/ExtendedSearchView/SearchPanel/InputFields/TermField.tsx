import React, { ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { makeStyles } from '@material-ui/core/styles'

import {
  SearchInputField,
  SearchInputFieldProps,
} from 'src/components/search/shared/SearchInput'
import { useSearchTranslation } from 'src/components/search/utils'
import { searchActions } from 'src/contexts/actions/searchActions'
import { extSearchSelectors } from 'src/contexts/selectors'

const useStyles = makeStyles((theme) => ({
  inputBaseExtended: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  selectPadding: {
    padding: theme.spacing(1),
  },
}))

interface Props {
  fieldType: string
  searchField: string
  index: number
  groupId: string
}
export default function TermField(
  props: Readonly<SearchInputFieldProps> & Props,
) {
  const cls = useStyles()
  const { searchT } = useSearchTranslation()
  const extFieldInfo = useSelector(extSearchSelectors.getExtendedFieldInfo)

  const {
    index,
    fieldType,
    searchTerm,
    handleInputKeyDown,
    searchField,
    groupId,
  } = props

  const dispatch = useDispatch()
  const inputRefBar = React.useRef<HTMLInputElement>(null)

  const handleResetClick = (index: number) => {
    inputRefBar.current?.focus()
    dispatch(
      searchActions.setNewExtSearchValue({
        index,
        value: '',
        groupId,
        property: 'searchTerm',
      }),
    )
  }
  const handleInputChange = (
    index: number,
    event:
      | React.ChangeEvent<HTMLInputElement>
      | ChangeEvent<{ value: unknown }>,
  ) => {
    dispatch(
      searchActions.setNewExtSearchValue({
        index,
        value: event.target.value as string,
        groupId,
        property: 'searchTerm',
      }),
    )
  }

  const sortedSearchValues = (first: string, second: string) => {
    // TODO: introduce ordered enums to remove this explicit check for format-search to return always true
    if (searchField === 'format-search') return 1
    return searchT('data', searchField, first) >
      searchT('data', searchField, second)
      ? 1
      : -1
  }

  if (fieldType === 'ENUM') {
    const entry = (
      extFieldInfo.find((entry) => entry.name === searchField) as {
        values: any
      }
    ).values.toSorted((first: string, second: string) =>
      sortedSearchValues(first, second),
    )

    return (
      <Select
        native={false}
        disableUnderline
        classes={{
          select: cls.selectPadding,
        }}
        inputProps={{
          'aria-label': searchT('searchBar', 'searchFieldSelection'),
        }}
        id="termSelect"
        onChange={(e) => handleInputChange(index, e)}
        value={searchTerm}
      >
        {entry.map((value: any) => (
          <MenuItem value={value} key={value}>
            {searchT('data', searchField, value)}
          </MenuItem>
        ))}
      </Select>
    )
  }

  if (fieldType === 'BOOLEAN') {
    const boolOptions = ['true', 'false']
    return (
      <Select
        native={false}
        disableUnderline
        classes={{
          select: cls.selectPadding,
        }}
        inputProps={{
          'aria-label': searchT('searchBar', 'searchFieldSelection'),
        }}
        id="termSelect"
        onChange={(e) => handleInputChange(index, e)}
        value={searchTerm}
      >
        {boolOptions.map((value) => (
          <MenuItem value={value} key={value}>
            {searchT('data', searchField, value)}
          </MenuItem>
        ))}
      </Select>
    )
  }

  return (
    <SearchInputField
      searchTerm={searchTerm}
      handleInputKeyDown={handleInputKeyDown}
      handleResetClick={() => handleResetClick(index)}
      handleInputChange={(e) => handleInputChange(index, e)}
      aria-label={searchT('searchBar', 'search')}
      inputRefBar={inputRefBar}
      className={cls.inputBaseExtended}
      type={fieldType}
    />
  )
}
