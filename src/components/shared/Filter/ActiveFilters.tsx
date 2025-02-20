import clsx from 'clsx'
import React from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

import { useSearchTranslation } from 'src/components/search/utils'
import { FilterChip } from 'src/components/shared/Filter/FilterChip'
import { catalogActions } from 'src/contexts/actions/catalogActions'
import { searchActions } from 'src/contexts/actions/searchActions'
import { isBooleanArray, isRangeFilterData, isStringArray } from 'src/utils'
import {
  ParsedSearchParams,
  RangeFilterData,
  toSearchParams,
  useParsedSearchParams,
} from 'src/utils/searchparams'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    [theme.breakpoints.only('xs')]: {
      paddingLeft: theme.spacing(3),
    },
  },
  chip: {
    marginTop: 5,
    marginRight: 5,
  },
}))

interface Props {
  className?: string
}

export function ActiveFilters(props: Readonly<Props>) {
  const { className } = props
  const cls = useStyles()
  const { searchT } = useSearchTranslation()
  const navigate = useNavigate()

  const dispatch = useDispatch()
  const location = useLocation()
  const isInSearch = location.pathname.includes('search')

  const { fq, ...queryWithoutFq } = useParsedSearchParams()

  if (!fq || Object.keys(fq).length === 0) {
    return null
  }

  const resetModifiedFilterQuery = () => {
    const action = isInSearch ? searchActions : catalogActions
    dispatch(action.setModifiedFilterQuery(undefined))
  }

  const handleRemoveChip = function (
    filterName: string,
    value: string | boolean | RangeFilterData,
  ) {
    const newQuery: ParsedSearchParams = { ...queryWithoutFq }
    const { [filterName]: thisFilter, ...newFilters } = fq

    if (thisFilter === undefined) {
      return
    }
    if (typeof value === 'string') {
      const newFilterForField = (thisFilter as string[]).filter(
        (v) => v !== value,
      )
      if (newFilterForField.length > 0) {
        newFilters[filterName] = newFilterForField
      }
    }
    if (Object.keys(newFilters).length > 0) {
      newQuery.fq = newFilters
    }
    newQuery.start = 0
    resetModifiedFilterQuery()
    navigate(`${location.pathname}?${toSearchParams(newQuery)}`)
  }

  const renderMultivalueFilterChip = function (
    filterName: string,
    value: string,
  ) {
    const labelValue =
      value === '__MISSING__'
        ? searchT('filterPanel', 'missing')
        : searchT('data', filterName, value)
    return (
      <FilterChip
        key={`chip-filter-${filterName}-${value}`}
        className={cls.chip}
        label={`${searchT('data', filterName, '__field__')}: ${labelValue}`}
        onRemove={() => handleRemoveChip(filterName, value)}
      />
    )
  }

  const renderBooleanFilterChip = function (
    filterName: string,
    value: boolean,
  ) {
    return (
      <FilterChip
        key={`chip-filter-${filterName}`}
        className={cls.chip}
        label={`${searchT('data', filterName, '__field__')}`}
        onRemove={() => handleRemoveChip(filterName, value)}
      />
    )
  }

  const renderRangeFilterChip = function (
    filterName: string,
    value: RangeFilterData,
  ) {
    return (
      <FilterChip
        key={`chip-filter-${filterName}`}
        className={cls.chip}
        label={
          `${searchT('data', filterName, '__field__')}: ${value.from} - ${
            value.to
          }` +
          (value.exact ? `, ${searchT('filterPanel', 'exactPeriod')}` : '') +
          (value.missing ? `, ${searchT('filterPanel', 'missing')}` : '')
        }
        onRemove={() => handleRemoveChip(filterName, value)}
      />
    )
  }

  return (
    <div
      data-testid="discovery-list-view-active-filters"
      className={clsx(cls.root, className)}
    >
      {Object.keys(fq).map((filterName) => {
        const values = fq[filterName]
        if (isStringArray(values) && values.length > 0) {
          return values.map((value) =>
            renderMultivalueFilterChip(filterName, value),
          )
        } else if (isBooleanArray(values) && values.length > 0) {
          return renderBooleanFilterChip(filterName, true)
        } else if (isRangeFilterData(values)) {
          return renderRangeFilterChip(filterName, values)
        } else {
          return null
        }
      })}
      <Button
        className={isInSearch ? '' : 'addFocusableWhite'}
        onClick={() => {
          resetModifiedFilterQuery()
          navigate(
            `${location.pathname}?${toSearchParams({
              ...queryWithoutFq,
              start: 0,
            })}`,
          )
        }}
      >
        {searchT('filterPanel', 'removeAllFilters')}
      </Button>
    </div>
  )
}
