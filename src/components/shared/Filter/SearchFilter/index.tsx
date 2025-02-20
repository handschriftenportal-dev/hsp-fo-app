import React, { useEffect, useState } from 'react'
import { AutoSizer, CellMeasurerCache, List } from 'react-virtualized'

import { makeStyles } from '@material-ui/core/styles'

import { useSearchTranslation } from 'src/components/search/utils'

import { SearchInput } from './SearchInput'
import { rowRenderer } from './rowRenderer'

export type Options = Record<string, number>

interface Props {
  filterName: string
  sortedOptions: Options
  selected: (string | boolean)[]
  toggleValue: (ev: React.ChangeEvent<HTMLInputElement>) => void
}

const useStyles = makeStyles(() => ({
  listContainer: {
    height: '100%',
    maxHeight: '350px',
  },
}))

export function SearchFilter(props: Readonly<Props>) {
  const cls = useStyles()
  const { searchT } = useSearchTranslation()
  const { sortedOptions, selected, toggleValue, filterName } = props

  const [showAll, setShowAll] = useState(false)
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [inputQuery, setInputQuery] = useState('')
  const [filteredResults, setFilteredResults] = useState<string[]>([])

  const searchFilter = () => {
    const query = debouncedQuery.toLocaleLowerCase()
    return Object.keys(sortedOptions).filter((key) =>
      key === '__MISSING__'
        ? searchT('data', '__MISSING__').toLowerCase().includes(query)
        : searchT('data', filterName, key).toLocaleLowerCase().includes(query),
    )
  }

  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 350,
    minHeight: 36,
  })

  // Update debounced query after a delay
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(inputQuery), 500)
    return () => clearTimeout(timer)
  }, [inputQuery])

  // Filter options based on debounced query
  useEffect(() => {
    setFilteredResults(() => searchFilter())
  }, [debouncedQuery, sortedOptions])

  const getRowCount = () => {
    if (filteredResults.length === 0) {
      return 1
    } else if (showAll) {
      return filteredResults.length
    } else {
      return Math.min(filteredResults.length, 8)
    }
  }

  return (
    <div>
      <SearchInput
        filterName={filterName}
        inputQuery={inputQuery}
        debouncedQuery={debouncedQuery}
        setInputQuery={setInputQuery}
      />
      <AutoSizer disableHeight>
        {({ width }) => (
          <List
            className={cls.listContainer}
            deferredMeasurementCache={cache}
            height={350}
            tabIndex={-1}
            rowCount={getRowCount()}
            rowRenderer={(rowProps) =>
              rowRenderer({
                ...rowProps,
                setShowAll,
                keyValue: rowProps.key,
                showAll,
                cache,
                inputQuery,
                filteredResults,
                sortedOptions,
                filterName,
                selected,
                toggleValue,
              })
            }
            rowHeight={cache.rowHeight}
            width={width}
          />
        )}
      </AutoSizer>
    </div>
  )
}
