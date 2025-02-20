import React from 'react'
import { useLocation } from 'react-router-dom'

import { filterTypes as catalogFilterTypes } from 'src/components/catalogs/config'
import {
  filterUnits,
  filterTypes as searchFilterTypes,
} from 'src/components/search/config'
import { useSearchTranslation } from 'src/components/search/utils'
import { Facets, Stats } from 'src/contexts/discovery'
import { FilterQuery, RangeFilterData } from 'src/utils/searchparams'

import { ListFilter } from './ListFilter'
import { RangeFilter } from './RangeFilter'

interface Props {
  className?: string
  filterQuery: FilterQuery
  filterName: string
  facets: Facets
  stats: Stats
  onChange: (selected: FilterQuery[keyof FilterQuery]) => void
}

export function Filter(props: Readonly<Props>) {
  const { filterName, className, facets, stats, filterQuery, onChange } = props
  const location = useLocation()
  const filterType = location.pathname.includes('catalogs')
    ? catalogFilterTypes[filterName]
    : searchFilterTypes[filterName]

  const { searchT } = useSearchTranslation()

  const isList = filterType === 'list' || filterType === 'boolean-list'

  // //////////////////////////////////////////////////////
  // Assemble List Filter
  // //////////////////////////////////////////////////////

  if (isList) {
    const options = facets[filterName]

    if (!options || options.length === 0) {
      return <span>{searchT('filterPanel', 'noData')}</span>
    }

    return (
      <ListFilter
        className={className}
        filterName={filterName}
        isBool={filterType === 'boolean-list'}
        options={options}
        selected={(filterQuery[filterName] as string[]) || []}
        onChange={onChange}
      />
    )
  }

  // //////////////////////////////////////////////////////
  // Assemble Range Filter
  // //////////////////////////////////////////////////////

  if (filterType === 'range') {
    const isOrigDateFilter = filterName === 'orig-date-facet'
    let minmax = [stats[filterName]?.min, stats[filterName]?.max]
    // TODO: add back missingCount when data is in facet info, instead of stats
    // let missingCount = stats[filterName]?.missing
    if (isOrigDateFilter) {
      minmax = [
        stats['orig-date-from-facet']?.min,
        stats['orig-date-to-facet']?.max,
      ]
      // missingCount = Math.min(
      //   stats['orig-date-from-facet']?.missing,
      //   stats['orig-date-to-facet']?.missing
      // )
    }

    let options = minmax.every((x) => typeof x === 'number')
      ? (minmax as [number, number])
      : undefined

    if (!options) {
      return <span>{searchT('filterPanel', 'noData')}</span>
    }

    options = options && [Math.floor(options[0]), Math.ceil(options[1])]

    const textMissing = `${searchT('filterPanel', 'missing')}` // (${missingCount})`

    return (
      <RangeFilter
        exactOption={isOrigDateFilter}
        label={filterName}
        textMissing={textMissing}
        options={options}
        selected={filterQuery[filterName] as RangeFilterData | undefined}
        onChange={onChange}
        unit={filterUnits?.[filterName]}
      />
    )
  }

  return null
}
