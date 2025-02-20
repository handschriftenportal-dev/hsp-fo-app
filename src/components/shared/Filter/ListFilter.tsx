import clsx from 'clsx'
import React from 'react'
import { useLocation } from 'react-router-dom'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import {
  getSortedFilterOptions,
  useSearchTranslation,
} from 'src/components/search/utils'

import { FilterCheckbox } from './FilterCheckbox'
import { SearchFilter } from './SearchFilter'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  option: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  more: {
    padding: theme.spacing(2),
    cursor: 'pointer',
  },
  missing: {
    fontStyle: 'italic',
    alignSelf: 'center',
  },
  caption: {
    alignSelf: 'center',
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
  whiteFont: {
    color: theme.palette.white.main,
  },
}))

type Options = Record<string, number>

interface Props {
  className?: string
  filterName: string
  isBool?: boolean
  options: Options
  selected: (string | boolean)[]
  onChange: (selected: (string | boolean)[]) => void
  sort?: 'alpha'
}

export function ListFilter(props: Readonly<Props>) {
  const { className, filterName, isBool, options, selected, sort, onChange } =
    props
  const { __MISSING__: missing } = options
  const cls = useStyles()
  const { searchT } = useSearchTranslation()
  const location = useLocation()
  const isCatalogFilter = location.pathname.includes('/catalogs')

  const sortedOptions = getSortedFilterOptions(isBool, missing, options, sort)

  function toggleValue(ev: React.ChangeEvent<HTMLInputElement>) {
    if (isBool) {
      onChange(ev.target.checked ? [ev.target.checked] : [])
    } else {
      onChange(
        ev.target.checked
          ? [...selected, ev.target.value]
          : selected.filter((val) => val !== ev.target.value),
      )
    }
  }

  const renderOptions = (start: number, end?: number) =>
    Object.keys(sortedOptions)
      .slice(start, end)
      .map((value) => {
        let text =
          searchT('data', filterName, value) + ` (${sortedOptions[value]})`
        let className = isCatalogFilter
          ? clsx(cls.caption, cls.whiteFont)
          : cls.caption

        if (value === '__MISSING__') {
          text = searchT('filterPanel', 'missing')
          className = isCatalogFilter
            ? clsx(cls.missing, cls.whiteFont)
            : cls.missing
        }

        return (
          <div key={value} className={cls.option}>
            <FormControlLabel
              label={
                <Typography
                  variant="caption"
                  component="span"
                  className={className}
                >
                  {text}
                </Typography>
              }
              control={
                <FilterCheckbox
                  value={value}
                  onChange={toggleValue}
                  iconText={text}
                  checked={
                    selected.indexOf(isBool ? Boolean(value) : value) > -1
                  }
                />
              }
            />
          </div>
        )
      })

  return (
    <div className={clsx(cls.root, className)}>
      {(Object.keys(options).length <= 15 &&
        renderOptions(0, Object.keys(options).length)) || (
        <SearchFilter
          sortedOptions={sortedOptions}
          selected={selected}
          toggleValue={toggleValue}
          filterName={filterName}
        />
      )}
    </div>
  )
}
