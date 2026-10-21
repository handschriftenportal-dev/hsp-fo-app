import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from 'tss-react/mui'

import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'

import {
  SearchInputField,
  SearchInputFieldProps,
} from 'src/components/search/shared/SearchInput'
import { useSearchTranslation } from 'src/components/search/utils'
import { searchActions } from 'src/contexts/actions/searchActions'
import { extSearchSelectors } from 'src/contexts/selectors'

import { findExtFieldInfoValues } from '../../../../utils/extendedSearch'

const useStyles = makeStyles()((theme) => ({
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
  const { classes: cls } = useStyles()
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
    event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<unknown>,
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

  const menuValues = findExtFieldInfoValues(extFieldInfo, searchField)

  if (
    menuValues &&
    (fieldType === 'enum' || fieldType === 'string' || fieldType === 'text')
  ) {
    const entry = [...menuValues].sort(sortedSearchValues)

    return (
      <Select
        native={false}
        variant="standard"
        disableUnderline
        classes={{
          select: cls.selectPadding,
        }}
        inputProps={{
          'aria-label': searchT('searchBar', 'searchFieldSelection'),
        }}
        id="termSelect"
        onChange={(e) => handleInputChange(index, e)}
        value={
          typeof searchTerm === 'string' && entry.includes(searchTerm)
            ? searchTerm
            : ''
        }
      >
        {entry.map((value) => (
          <MenuItem value={value} key={value}>
            {searchT('data', searchField, value)}
          </MenuItem>
        ))}
      </Select>
    )
  }

  if (fieldType === 'boolean') {
    const boolOptions = ['true', 'false']
    return (
      <Select
        native={false}
        variant="standard"
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
