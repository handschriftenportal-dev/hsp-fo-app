import clsx from 'clsx'
import { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router'
import { makeStyles } from 'tss-react/mui'

import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import { searchSelectors } from 'src/contexts/selectors'

import {
  ParsedSearchParams,
  useParsedSearchParams,
} from '../../../utils/searchparams'
import BackButton from '../shared/BackButton'

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1,
    [theme.breakpoints.up('md')]: {
      alignItems: 'center',
    },
    [theme.breakpoints.only('xs')]: {
      flexDirection: 'column',
    },
  },
  upper: {
    display: 'flex',
  },
  lower: {
    display: 'flex',
    paddingTop: theme.spacing(1),
    left: theme.spacing(-1),
    justifyContent: 'space-between',
  },
  lowerExtended: {
    display: 'flex',
    flexWrap: 'wrap',
    paddingTop: theme.spacing(1),
    flexDirection: 'row-reverse',
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.only('lg')]: {
      flexShrink: 0,
    },
    [theme.breakpoints.up('lg')]: {
      width: '50%',
    },
    [theme.breakpoints.down('xl')]: {
      width: '75%',
    },
    [theme.breakpoints.down('lg')]: {
      width: '100%',
    },
  },
  homeCenter: {
    width: 'unset',
  },
}))

interface Props {
  searchFieldSelection: ReactElement
  input: ReactElement
  searchButton: ReactElement
  extendedButton: ReactElement
}

export function Layout(props: Readonly<Props>) {
  const { classes: cls } = useStyles()
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true })
  const params: ParsedSearchParams = useParsedSearchParams()
  const { pathname } = useLocation()
  const inExtendedView = pathname === '/extended'
  const { input, searchButton, searchFieldSelection, extendedButton } = props
  const searchParams = useSelector(searchSelectors.getSearchParams)

  const inHome = pathname === '/'

  const backParams = {
    hspobjectid: undefined,
    isExtended: undefined,
  }

  const searchBar = () => {
    if (mobile) {
      return (
        <>
          <div className={cls.upper}>
            {input}
            {searchButton}
          </div>
          <div className={cls.lower}>
            {searchFieldSelection}
            {extendedButton}
          </div>
        </>
      )
    }
    return (
      <>
        <div className={clsx(cls.center, 'searchBarCenter')}>
          {searchFieldSelection}
          {input}
          {searchButton}
        </div>
        {extendedButton}
      </>
    )
  }

  const extendedSearchBar = <></>

  const activeExtendedSearchBar = () => {
    if (mobile) {
      return (
        <>
          {input}
          <div className={cls.lowerExtended}>
            {extendedButton}
            <BackButton
              backParams={backParams}
              preventScrollReset={false}
              btnType="extendedBtn"
            />
          </div>
        </>
      )
    }
    return (
      <>
        <div
          className={
            inHome
              ? clsx(cls.center, cls.homeCenter, '')
              : clsx(cls.center, 'extSearchBarCenter')
          }
        >
          {input}
          {extendedButton}
        </div>
        <BackButton
          backParams={backParams}
          preventScrollReset={false}
          btnType="extendedBtn"
        />
      </>
    )
  }
  const searchBarType =
    (params.isExtended ?? searchParams.isExtended)
      ? activeExtendedSearchBar()
      : searchBar()

  return (
    <div id="hsp-search-search-bar" className={cls.root} role="search">
      {inExtendedView ? extendedSearchBar : searchBarType}
    </div>
  )
}
