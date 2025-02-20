import clsx from 'clsx'
import React from 'react'
import { useLocation } from 'react-router-dom'

import makeStyles from '@material-ui/core/styles/makeStyles'
import useTheme from '@material-ui/core/styles/useTheme'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import { SearchBarOrOverviewNavigation } from 'src/components/search/SearchBarOrOverviewNavigation'
import { AuthorityFile } from 'src/pages/AuthorityFile'
import {
  ParsedSearchParams,
  useParsedSearchParams,
} from 'src/utils/searchparams'

import { AuthorityFileNavigation } from './AuthorityFileNavigation'

const useStyles = makeStyles((theme) => ({
  left: {
    paddingLeft: theme.spacing(3),
  },
  margin: {
    [theme.breakpoints.down('lg')]: {
      position: 'unset !important',
      marginRight: theme.spacing(4),
    },
  },
  right: {
    width: '50%',
    position: 'fixed',
    left: 'calc(100% / 3)',
    [theme.breakpoints.up('sm')]: {
      borderLeft: 'thin outset' + theme.palette.platinum.main,
    },
    [theme.breakpoints.down('sm')]: {
      left: '40%',
    },
    // classes coming from hsp-fo-search
    '& .searchSelect': {
      [theme.breakpoints.up('sm')]: {
        borderLeft: 'thin outset' + theme.palette.platinum.main,
      },
    },
  },
}))

export function SearchBarContainer() {
  const cls = useStyles()

  const location = useLocation()
  const { fromWorkspace }: ParsedSearchParams = useParsedSearchParams()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'), { noSsr: true })

  const getClassName = () => {
    if (isMobile) {
      return ''
    } else {
      return fromWorkspace ? clsx(cls.right, cls.margin) : cls.right
    }
  }

  return (
    <div className={getClassName()}>
      {location.pathname.includes('search') && (
        <SearchBarOrOverviewNavigation />
      )}
      {location.pathname.includes('authority-files') && (
        <AuthorityFileNavigation />
      )}
      {/* {location.pathname.includes('catalogs') && <SearchBar />} */}
    </div>
  )
}
