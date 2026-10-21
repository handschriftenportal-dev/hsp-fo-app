import clsx from 'clsx'
import { ChangeEvent, KeyboardEvent, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router'
import { makeStyles } from 'tss-react/mui'

import LaunchIcon from '@mui/icons-material/Launch'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { SelectChangeEvent } from '@mui/material/Select'

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

const useStyles = makeStyles()((theme) => ({
  searchButton: {
    marginLeft: theme.spacing(1),
  },
  extendedButton: {
    minWidth: 110,
    whiteSpace: 'nowrap',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(2),
    },
    [theme.breakpoints.down('lg')]: {
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
  const { classes: cls } = useStyles()
  const dispatch = useDispatch()
  const params: ParsedSearchParams = useParsedSearchParams()
  const { q, qf, fq, sort, rows, isExtended } = params
  const searchTerm = useSelector(searchSelectors.getSearchTerm)
  const searchField = useSelector(searchSelectors.getSearchField)
  const inputRefBar = useRef<HTMLInputElement>(null)
  const { searchT } = useSearchTranslation()
  const navigate = useNavigate()
  const tracker = useTracker()

  const searchParams = useSelector(searchSelectors.getSearchParams)

  // Build the search-bar navigation targets from the live search-bar state.
  // Do NOT write the shared searchParams mirror here: it doubles as the
  // cross-route memory of the last search (sidebar "Suche" link, back buttons),
  // and this bar also mounts on the home page, so resetting start to 0 here
  // would wipe the remembered result page and drop the user back to page 1 on
  // return (#24550). A submitted search always starts on page 1, hence start: 0.
  const nextSearch: ParsedSearchParams = {
    ...searchParams,
    hl: true,
    q: searchTerm || undefined,
    qf: searchField !== 'FIELD-GROUP-ALL' ? searchField : undefined,
    fq: fq ?? searchParams.fq,
    isExtended: isExtended ?? searchParams.isExtended,
    rows: rows ?? searchParams.rows,
    sort: sort ?? searchParams.sort,
    start: 0,
    hspobjectid: undefined,
  }
  const to = `/search?${toSearchParams(nextSearch)}`
  // Opening the extended search must not lose the current result page: nextSearch
  // forces start:0 (a submitted search restarts on page 1), but "Extended Search"
  // only navigates to the extended view, from which "Discard" should return to
  // the exact prior state (page included). Carry the live page over so it survives
  // in the /search/extended URL and is restored on cancel (#24550 follow-up).
  const extendedParams = {
    ...nextSearch,
    fromWorkspace: undefined,
    isExtended,
    start: params.start ?? searchParams.start,
  }

  useEffect(() => {
    dispatch(searchActions.setSearchTerm(q ?? searchTerm))
    dispatch(searchActions.setSearchField(qf ?? searchField))
  }, [q, qf])

  function search() {
    tracker.trackSiteSearch('Search', searchTerm)
    tracker.trackSiteSearch('Search', JSON.stringify({ qf: nextSearch.qf }))
    dispatch(searchActions.setAuthorityId(''))
    dispatch(searchActions.setShowFilterList(false))
    dispatch(searchActions.deleteAllHits())
  }
  function handleInputChange(ev: ChangeEvent<HTMLInputElement>): void {
    dispatch(searchActions.setSearchTerm(ev.target.value))
  }

  function handleFieldChange(ev: SelectChangeEvent<unknown>): void {
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
      aria-label={searchT('searchBar', 'searchButton')}
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
