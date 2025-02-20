import clsx from 'clsx'
import React from 'react'
import { useDispatch } from 'react-redux'

import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { makeStyles } from '@material-ui/core/styles'

import { ComparisonOperator } from 'src/components/search/config'
import { useSearchTranslation } from 'src/components/search/utils'
import { searchActions } from 'src/contexts/actions/searchActions'

const useStyles = makeStyles((theme) => ({
  operator: {
    minWidth: 100,
  },
  select: {
    marginRight: 8,
    '&:hover': {
      backgroundColor: theme.palette.platinum.main,
    },
  },
  selectPadding: {
    padding: theme.spacing(1),
  },
  hide: {
    display: 'none',
  },
}))

interface Props {
  searchOperator: string
  fieldType: string
  index: number
  groupId: string
}

export default function OperatorSelect(props: Readonly<Props>) {
  const cls = useStyles()
  const { searchT } = useSearchTranslation()

  const dispatch = useDispatch()

  const { searchOperator, fieldType, index, groupId } = props

  const isRange =
    fieldType === 'integer' || fieldType === 'float' || fieldType === 'year'
  const isNegationable = fieldType === 'text' || fieldType === 'enum'

  const onChange = (
    index: number,
    e: React.ChangeEvent<{
      value: unknown
    }>,
  ) => {
    if ((e.target.value as string) !== undefined) {
      dispatch(
        searchActions.setNewExtSearchValue({
          index,
          value: e.target.value as ComparisonOperator,
          groupId,
          property: 'comparisonOperator',
        }),
      )
    }
  }

  return (
    <Select
      native={false}
      className={clsx(cls.select, cls.operator, 'searchSelect')}
      disableUnderline
      classes={{
        select: cls.selectPadding,
      }}
      inputProps={{
        'aria-label': searchT('searchBar', 'searchFieldSelection'),
        ...(fieldType === 'boolean' && { readOnly: true }),
      }}
      onChange={(e) => onChange(index, e)}
      value={searchOperator}
      id="extendedSearchOperator"
    >
      <MenuItem key={'eq'} value={ComparisonOperator.EQ}>
        {fieldType === 'text'
          ? searchT('extendedSearch', 'eq')
          : searchT('extendedSearch', 'is')}
      </MenuItem>
      <MenuItem
        key={'neq'}
        value={ComparisonOperator.NEQ}
        className={!isNegationable ? cls.hide : ''}
      >
        {fieldType === 'text'
          ? searchT('extendedSearch', 'neq')
          : searchT('extendedSearch', 'isNot')}
      </MenuItem>
      {/* Range Operators */}
      <MenuItem
        className={!isRange ? cls.hide : ''}
        key={'le'}
        value={ComparisonOperator.LE}
      >
        {searchT('extendedSearch', 'le')}
      </MenuItem>
      <MenuItem
        className={!isRange ? cls.hide : ''}
        key={'lt'}
        value={ComparisonOperator.LT}
      >
        {searchT('extendedSearch', 'lt')}
      </MenuItem>
      <MenuItem
        className={!isRange ? cls.hide : ''}
        key={'ge'}
        value={ComparisonOperator.GE}
      >
        {searchT('extendedSearch', 'ge')}
      </MenuItem>
      <MenuItem
        className={!isRange ? cls.hide : ''}
        key={'gt'}
        value={ComparisonOperator.GT}
      >
        {searchT('extendedSearch', 'gt')}
      </MenuItem>
    </Select>
  )
}
