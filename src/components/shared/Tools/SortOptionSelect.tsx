import clsx from 'clsx'
import React, { ChangeEvent } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import FormControl from '@material-ui/core/FormControl'
import NativeSelect from '@material-ui/core/NativeSelect'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import { sortOptions } from 'src/components/search/config'
import { useSearchTranslation } from 'src/components/search/utils'
import { searchActions } from 'src/contexts/actions/searchActions'
import { toSearchParams, useParsedSearchParams } from 'src/utils/searchparams'

const useStyles = makeStyles((theme) => ({
  itemTypo: theme.typography.caption,
  select: {
    height: 32,
    width: '90%',
    boxShadow: 'none',
    borderRadius: 0,
    marginRight: 2,
    background: theme.palette.platinum.main,
    paddingRight: theme.spacing(0),
  },
  selected: {
    background: 'white',
  },
}))

interface Props {
  className?: string
}

export function SortOptionSelect(props: Readonly<Props>) {
  const { className } = props
  const cls = useStyles()
  const { searchT } = useSearchTranslation()

  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('xs'), { noSsr: true })
  const params = useParsedSearchParams()
  const sortOption =
    params.sort && sortOptions.indexOf(params.sort) >= 0
      ? params.sort
      : 'score-desc'
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const change = (event: ChangeEvent<{ name?: string; value?: any }>) => {
    const sortOption = event.target.value
    const sortParams = { ...params, sort: sortOption }
    navigate(`/search?${toSearchParams(sortParams)}`)
    dispatch(searchActions.deleteAllHits())
  }

  return (
    <FormControl className={className} variant="filled">
      <NativeSelect
        data-testid="discovery-search-bar-sort-select"
        className={clsx(cls.select, cls.itemTypo)}
        value={sortOption}
        onChange={change}
        name={searchT('sortOptionName')}
        inputProps={{
          'aria-label': searchT('sortOptionName'),
          style: { textIndent: '8px' },
        }}
      >
        {sortOptions.map((option) => (
          <option key={option} value={option}>
            {(mobile &&
              searchT(
                'sortOptionsMobile',
                option.replace(/-([a-z])/g, function (value: string) {
                  return value[1].toUpperCase()
                }),
              )) ||
              searchT(
                'sortOptions',
                option.replace(/-([a-z])/g, function (value: string) {
                  return value[1].toUpperCase()
                }),
              )}
          </option>
        ))}
      </NativeSelect>
    </FormControl>
  )
}
