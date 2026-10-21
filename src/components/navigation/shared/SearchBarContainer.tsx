import clsx from 'clsx'
import { useLocation } from 'react-router'
import { makeStyles } from 'tss-react/mui'

import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import { SearchBarOrOverviewNavigation } from 'src/components/search/SearchBarOrOverviewNavigation'
import {
  ParsedSearchParams,
  useParsedSearchParams,
} from 'src/utils/searchparams'

import { AuthorityFileNavigation } from './AuthorityFileNavigation'

const useStyles = makeStyles()((theme) => ({
  left: {
    paddingLeft: theme.spacing(3),
  },
  margin: {
    [theme.breakpoints.down('xl')]: {
      position: 'unset !important' as unknown as 'unset',
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
    [theme.breakpoints.down('md')]: {
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
  const { classes: cls } = useStyles()

  const location = useLocation()
  const { fromWorkspace }: ParsedSearchParams = useParsedSearchParams()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true })

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
