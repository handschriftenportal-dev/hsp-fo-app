import { useVirtualizer } from '@tanstack/react-virtual'
import React, { useEffect, useRef, useState } from 'react'
import { makeStyles } from 'tss-react/mui'

import { useSearchTranslation } from 'src/components/search/utils'

import { SearchInput } from './SearchInput'
import { SearchRow } from './rowRenderer'

export type Options = Record<string, number>

interface Props {
  filterName: string
  sortedOptions: Options
  selected: (string | boolean)[]
  toggleValue: (ev: React.ChangeEvent<HTMLInputElement>) => void
}

const useStyles = makeStyles()(() => ({
  listContainer: {
    height: 350,
    maxHeight: 350,
    overflow: 'auto',
  },
}))

const MAX_VISIBLE = 7

export function SearchFilter(props: Readonly<Props>) {
  const { classes: cls } = useStyles()
  const { searchT } = useSearchTranslation()
  const { sortedOptions, selected, toggleValue, filterName } = props

  const [showAll, setShowAll] = useState(false)
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [inputQuery, setInputQuery] = useState('')
  const [filteredResults, setFilteredResults] = useState<string[]>([])

  const parentRef = useRef<HTMLDivElement>(null)

  const searchFilter = () => {
    const query = debouncedQuery.toLocaleLowerCase()
    return Object.keys(sortedOptions).filter((key) =>
      key === '__MISSING__'
        ? searchT('data', '__MISSING__').toLowerCase().includes(query)
        : searchT('data', filterName, key).toLocaleLowerCase().includes(query),
    )
  }

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(inputQuery), 500)
    return () => clearTimeout(timer)
  }, [inputQuery])

  useEffect(() => {
    setFilteredResults(() => searchFilter())
  }, [debouncedQuery, sortedOptions])

  const isTruncated = !showAll && inputQuery.length < 1
  const showToggle =
    inputQuery.length < 1 && filteredResults.length > MAX_VISIBLE
  const visibleCount = isTruncated
    ? Math.min(filteredResults.length, MAX_VISIBLE)
    : filteredResults.length
  const rowCount = visibleCount + (showToggle ? 1 : 0)

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 36,
    overscan: 5,
  })

  return (
    <div>
      <SearchInput
        filterName={filterName}
        inputQuery={inputQuery}
        debouncedQuery={debouncedQuery}
        setInputQuery={setInputQuery}
      />
      <div ref={parentRef} className={cls.listContainer} tabIndex={-1}>
        <div
          style={{
            height: virtualizer.getTotalSize(),
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => (
            <div
              key={String(virtualRow.key)}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <SearchRow
                index={virtualRow.index}
                setShowAll={setShowAll}
                showAll={showAll}
                inputQuery={inputQuery}
                filteredResults={filteredResults}
                sortedOptions={sortedOptions}
                filterName={filterName}
                selected={selected}
                toggleValue={toggleValue}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
