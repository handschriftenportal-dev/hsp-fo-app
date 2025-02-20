import clsx from 'clsx'
import React, {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/core/styles'
import LaunchIcon from '@material-ui/icons/Launch'

import { searchActions } from 'src/contexts/actions/searchActions'
import { searchSelectors } from 'src/contexts/selectors'
import { useTracker } from 'src/contexts/tracking'
import {
  ParsedSearchParams,
  toSearchParams,
  useParsedSearchParams,
} from 'src/utils/searchparams'

import { searchBarOptions } from '../config'
import { SearchFieldSelection, SearchInputField } from '../shared/SearchInput'
import { useSearchTranslation } from '../utils'
import { Layout } from './Layout'

const useStyles = makeStyles((theme) => ({
  searchButton: {
    marginLeft: theme.spacing(1),
  },
  extendedButton: {
    minWidth: 110,
    whiteSpace: 'nowrap',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(2),
    },
    [theme.breakpoints.down('md')]: {
      width: 110,
      whiteSpace: 'normal',
      fontSize: '0.675rem',
      lineHeight: '0.9rem',
    },
    [theme.breakpoints.only('lg')]: {
      flexShrink: 0,
    },
  },
}))

export function SearchBar() {
  const cls = useStyles()
  const dispatch = useDispatch()
  const params: ParsedSearchParams = useParsedSearchParams()
  const { q, qf, fq, sort, rows, isExtended, start } = params
  const searchTerm = useSelector(searchSelectors.getSearchTerm)
  const searchField = useSelector(searchSelectors.getSearchField)
  const inputRefBar = useRef<HTMLInputElement>(null)
  const { searchT } = useSearchTranslation()
  const navigate = useNavigate()
  const tracker = useTracker()

  const searchParams = useSelector(searchSelectors.getSearchParams)
  const extendedParams = {
    ...searchParams,
    hspobjectid: undefined,
    fromWorkspace: undefined,
    isExtended: params.isExtended,
  }
  const [to, setTo] = useState(`/search?${toSearchParams(searchParams)}`)

  useEffect(() => {
    dispatch(searchActions.setSearchTerm(q ?? searchTerm))
    dispatch(searchActions.setSearchField(qf ?? searchField))
  }, [q, qf])

  useEffect(() => {
    const newParams = {
      ...searchParams,
      hl: true,
      q: searchTerm || '',
      qf: searchField !== 'FIELD-GROUP-ALL' ? searchField : undefined,
      fq: fq ?? searchParams.fq,
      isExtended: params.isExtended ?? searchParams.isExtended,
      rows: params.rows ?? searchParams.rows,
      start: params.start ?? searchParams.start,
      sort: params.sort ?? searchParams.sort,
      hspobjectid: params.hspobjectid ?? searchParams.hspobjectid,
    }
    dispatch(searchActions.setSearchParams(newParams))
  }, [searchTerm, searchField, sort, rows, isExtended, start])

  useEffect(() => {
    setTo(
      `/search?${toSearchParams({ ...searchParams, hspobjectid: undefined })}`,
    )
  }, [searchParams])

  function search() {
    tracker.trackSiteSearch('Search', searchTerm)
    tracker.trackSiteSearch('Search', JSON.stringify({ qf: searchParams.qf }))
    dispatch(searchActions.setAuthorityId(''))
    dispatch(searchActions.setShowFilterList(false))
    dispatch(searchActions.deleteAllHits())
  }
  function handleInputChange(ev: ChangeEvent<HTMLInputElement>): void {
    dispatch(searchActions.setSearchTerm(ev.target.value))
  }

  function handleFieldChange(ev: ChangeEvent<{ value: unknown }>): void {
    dispatch(searchActions.setSearchField(ev.target.value as string))
  }

  function handleInputKeyDown(ev: KeyboardEvent<HTMLInputElement>): void {
    if (ev.key === 'Enter') {
      search()
      navigate(to)
      dispatch(searchActions.setAuthorityId(''))
    }
  }

  function handleResetClick() {
    inputRefBar.current?.focus()
    dispatch(searchActions.setSearchTerm(''))
  }

  const searchFieldSelection = (
    <SearchFieldSelection
      searchField={searchField}
      handleFieldChange={handleFieldChange}
      aria-label={searchT('searchBar', 'searchFieldSelection')}
    >
      {searchBarOptions.map((option: string) => (
        <MenuItem key={option} value={option}>
          {option === 'FIELD-GROUP-ALL'
            ? searchT('searchBar', 'allFields')
            : searchT('data', option, '__field__')}
        </MenuItem>
      ))}
    </SearchFieldSelection>
  )

  const input = (
    <SearchInputField
      searchTerm={searchTerm}
      handleInputKeyDown={handleInputKeyDown}
      handleResetClick={handleResetClick}
      handleInputChange={handleInputChange}
      aria-label={searchT('searchBar', 'search')}
      inputRefBar={inputRefBar}
    />
  )

  const searchButton = (
    <Button
      className={cls.searchButton}
      color="primary"
      to={to}
      component={Link}
      onClick={search}
      aria-label={'searchButton'}
      variant="contained"
    >
      {searchT('searchBar', 'searchButton')}
    </Button>
  )

  const { pathname } = useLocation()

  const inExtendedView = pathname === '/extended'
  const extendedButton = (
    <Button
      aria-label={searchT('extendedSearch', 'extendedSearch')}
      component={Link}
      color={params.isExtended ? 'primary' : undefined}
      className={
        inExtendedView
          ? clsx(cls.extendedButton, 'searchExtBtn')
          : cls.extendedButton
      }
      startIcon={<LaunchIcon />}
      to={`/search/extended?${toSearchParams(extendedParams)}`}
      variant="contained"
    >
      {searchT('extendedSearch', 'extendedSearch')}
    </Button>
  )

  return (
    <Layout
      searchFieldSelection={searchFieldSelection}
      input={input}
      searchButton={searchButton}
      extendedButton={extendedButton}
    />
  )
}
