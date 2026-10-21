import clsx from 'clsx'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from 'tss-react/mui'

import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'

import { ComparisonOperator } from 'src/components/search/config'
import { useSearchTranslation } from 'src/components/search/utils'
import { searchActions } from 'src/contexts/actions/searchActions'

import { extSearchSelectors } from '../../../../../../contexts/selectors'
import { findExtFieldInfoValues } from '../../../../utils/extendedSearch'

const useStyles = makeStyles()((theme) => ({
  operator: {
    minWidth: 100,
  },
  select: {
    marginRight: 8,
    '&:hover': {
      backgroundColor: theme.palette?.platinum?.main,
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
  searchField: string
}

export default function OperatorSelect(props: Readonly<Props>) {
  const { classes: cls } = useStyles()
  const { searchT } = useSearchTranslation()
  const dispatch = useDispatch()
  const extFieldInfo = useSelector(extSearchSelectors.getExtendedFieldInfo)

  const { searchOperator, fieldType, index, groupId, searchField } = props
  const menuValues = findExtFieldInfoValues(extFieldInfo, searchField)

  const isRange =
    fieldType === 'integer' || fieldType === 'float' || fieldType === 'year'
  const isNegationable =
    fieldType === 'text' || fieldType === 'enum' || fieldType === 'string'

  const onChange = (index: number, e: SelectChangeEvent) => {
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
      data-testid="extendedSearchOperator"
      className={clsx(cls.select, cls.operator, 'searchSelect')}
      variant="standard"
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
        {!menuValues
          ? searchT('extendedSearch', 'eq')
          : searchT('extendedSearch', 'is')}
      </MenuItem>
      <MenuItem
        key={'neq'}
        value={ComparisonOperator.NEQ}
        className={!isNegationable ? cls.hide : ''}
      >
        {!menuValues
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
