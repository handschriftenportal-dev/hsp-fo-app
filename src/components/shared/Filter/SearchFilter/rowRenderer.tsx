import clsx from 'clsx'
import React, { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'
import { makeStyles } from 'tss-react/mui'

import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Typography from '@mui/material/Typography'

import { useSearchTranslation } from 'src/components/search/utils'

import { Options } from '.'
import { FilterCheckbox } from '../FilterCheckbox'

const useStyles = makeStyles()((theme) => ({
  btn: { fontWeight: 'unset' },
  caption: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
  catalogBtn: {
    color: theme.palette.white.main,
    '&:focus-visible': {
      outline: `${theme.spacing(0.5)} solid ${theme.palette.white.main} !important`,
      outlineOffset: `${theme.spacing(-0.5)} !important`,
    },
  },
  missing: {
    fontStyle: 'italic',
    alignSelf: 'center',
  },
  option: {
    paddingLeft: theme.spacing(0.5),
  },
  whiteFont: {
    color: theme.palette.white.main,
  },
}))

const MAX_VISIBLE = 7

interface RowProps {
  index: number
  setShowAll: (showAll: boolean) => void
  showAll: boolean
  inputQuery: string
  filteredResults: string[]
  sortedOptions: Options
  filterName: string
  selected: (string | boolean)[]
  toggleValue: (ev: React.ChangeEvent<HTMLInputElement>) => void
}

export function SearchRow({
  index,
  setShowAll,
  showAll,
  inputQuery,
  filteredResults,
  sortedOptions,
  filterName,
  selected,
  toggleValue,
}: Readonly<RowProps>) {
  const { classes: cls } = useStyles()
  const { searchT } = useSearchTranslation()
  const location = useLocation()
  const isCatalogFilter = location.pathname.includes('/catalogs')

  const prevShowAll = useRef(showAll)
  const checkBoxRef = useRef<HTMLLinkElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const isTruncated = !showAll && inputQuery.length < 1
  const showToggle =
    inputQuery.length < 1 && filteredResults.length > MAX_VISIBLE

  const visibleResults = isTruncated
    ? filteredResults.slice(0, MAX_VISIBLE)
    : filteredResults

  useEffect(() => {
    if (!prevShowAll.current && !showAll && buttonRef.current) {
      buttonRef.current.focus()
    }
    prevShowAll.current = showAll
  }, [showAll])

  const isToggleRow = index === visibleResults.length && showToggle
  if (isToggleRow) {
    const showMore = isTruncated
    return (
      <div className={cls.option}>
        <Button
          className={
            isCatalogFilter
              ? clsx(cls.btn, cls.catalogBtn, 'addFocusableWithWhiteOutline')
              : cls.btn
          }
          ref={buttonRef}
          onClick={() => setShowAll(showMore)}
        >
          {showMore
            ? searchT('filterPanel', 'showMoreFilterOptions')
            : searchT('filterPanel', 'showLessFilterOptions')}
        </Button>
      </div>
    )
  }

  if (index >= visibleResults.length) return null

  const value = visibleResults[index]
  const text =
    value === '__MISSING__'
      ? searchT('filterPanel', 'missing')
      : `${searchT('data', filterName, value)} (${sortedOptions[value]})`
  const labelClass = clsx(
    isCatalogFilter && cls.whiteFont,
    value === '__MISSING__' ? cls.missing : cls.caption,
  )

  return (
    <div className={cls.option}>
      <FormControlLabel
        inputRef={index === 0 ? checkBoxRef : undefined}
        label={
          <Typography variant="caption" component="span" className={labelClass}>
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
  )
}
