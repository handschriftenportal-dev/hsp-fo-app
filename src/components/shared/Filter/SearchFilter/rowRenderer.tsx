import clsx from 'clsx'
import React, { useRef } from 'react'
import { useLocation } from 'react-router-dom'
import {
  CellMeasurer,
  CellMeasurerCache,
  ListRowProps,
} from 'react-virtualized'

import Button from '@material-ui/core/Button'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/core/styles/makeStyles'

import { useSearchTranslation } from 'src/components/search/utils'

import { Options } from '.'
import { FilterCheckbox } from '../FilterCheckbox'

const useStyles = makeStyles((theme) => ({
  btn: { fontWeight: 'unset' },
  caption: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
  catalogBtn: {
    color: theme.palette.white.main,
    '&:focus-visible': {
      outline: `${theme.spacing(0.5)}px solid ${theme.palette.white.main} !important`,
      outlineOffset: `${theme.spacing(-0.5)}px !important`,
    },
  },
  missing: {
    fontStyle: 'italic',
    alignSelf: 'center',
  },
  noHit: {
    paddingLeft: theme.spacing(1),
    paddingTop: '5px',
  },
  option: {
    paddingLeft: theme.spacing(0.5),
  },
  whiteFont: {
    color: theme.palette.white.main,
  },
}))

interface RowProps extends ListRowProps {
  setShowAll: (showAll: boolean) => void
  keyValue: string
  showAll: boolean
  cache: CellMeasurerCache
  inputQuery: string
  filteredResults: string[]
  sortedOptions: Options
  filterName: string
  selected: (string | boolean)[]
  toggleValue: (ev: React.ChangeEvent<HTMLInputElement>) => void
}

function SearchRow({
  index,
  keyValue,
  style,
  parent,
  setShowAll,
  showAll,
  cache,
  inputQuery,
  filteredResults,
  sortedOptions,
  filterName,
  selected,
  toggleValue,
}: Readonly<RowProps>) {
  const cls = useStyles()
  const { searchT } = useSearchTranslation()
  const location = useLocation()
  const isCatalogFilter = location.pathname.includes('/catalogs')
  const checkBoxRef = useRef<HTMLLinkElement>(null)

  // Render the "show more/less" buttons
  const renderToggleButton = (showMore: boolean) => (
    <CellMeasurer
      key={keyValue}
      cache={cache}
      parent={parent}
      columnIndex={0}
      rowIndex={index}
    >
      {() => (
        <div style={style} className={cls.option}>
          <Button
            className={
              isCatalogFilter
                ? clsx(cls.btn, cls.catalogBtn, 'addFocusableWithWhiteOutline')
                : cls.btn
            }
            onClick={() => setShowAll(showMore)}
          >
            {showMore
              ? searchT('filterPanel', 'showMoreFilterOptions')
              : searchT('filterPanel', 'showLessFilterOptions')}
          </Button>
        </div>
      )}
    </CellMeasurer>
  )

  // Render no-hit message if there are no results
  if (filteredResults.length === 0) {
    return (
      <CellMeasurer
        key={keyValue}
        cache={cache}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
      >
        {() => (
          <div key={keyValue} className={cls.option} style={style}>
            <Typography
              variant="caption"
              component="span"
              className={cls.noHit}
            >
              {searchT('filterPanel', 'noHits')}
            </Typography>
          </div>
        )}
      </CellMeasurer>
    )
  }

  // Show toggle buttons based on index and visibility state
  if (index === 7 && !showAll && inputQuery.length < 1)
    return renderToggleButton(true)
  if (index === filteredResults.length - 1 && inputQuery.length < 1)
    return renderToggleButton(false)

  // Render the filtered option
  const value = filteredResults[index]
  const text =
    value === '__MISSING__'
      ? searchT('filterPanel', 'missing')
      : `${searchT('data', filterName, value)} (${sortedOptions[value]})`
  const labelClass = clsx(
    isCatalogFilter && cls.whiteFont,
    value === '__MISSING__' ? cls.missing : cls.caption,
  )

  return (
    <CellMeasurer
      key={keyValue}
      cache={cache}
      parent={parent}
      columnIndex={0}
      rowIndex={index}
    >
      {({ measure }) => (
        <div key={keyValue} style={style} className={cls.option}>
          <FormControlLabel
            inputRef={index === 0 ? checkBoxRef : undefined}
            onLoad={measure}
            label={
              <Typography
                variant="caption"
                component="span"
                className={labelClass}
              >
                {text}
              </Typography>
            }
            control={
              <FilterCheckbox
                value={value}
                onChange={toggleValue}
                iconText={text}
                checked={selected.includes(value)}
              />
            }
          />
        </div>
      )}
    </CellMeasurer>
  )
}

export const rowRenderer = (props: RowProps) => <SearchRow {...props} />
