import React from 'react'

import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import { SearchBar } from '../search/SearchBar'
import { Carousel } from './Carousel'

const useStyles = makeStyles((theme) => ({
  rootWeb: {
    display: 'grid',
    flexGrow: 1,
  },
  rootMobile: {
    height: '100%',
  },
  searchBarWeb: {
    gridRowStart: 1,
    gridColumnStart: 1,
    placeSelf: 'center',
    zIndex: 100,
    background: 'white',
    padding: theme.spacing(6),
    // class coming from hsp-fo-search
    '& .searchExtBtn': {
      backgroundColor: 'white',
    },
    '& .searchBarCenter': {
      width: 'unset',
    },
  },
  searchBarMobile: {
    position: 'absolute',
    top: '20%',
    left: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 100,
    background: 'white',
    padding: theme.spacing(4),
    paddingBottom: theme.spacing(1),
    // class coming from hsp-fo-search
    '& .searchExtBtn': {
      backgroundColor: 'white',
    },
  },
}))

export function Home() {
  const cls = useStyles()
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('xs'), { noSsr: true })

  return (
    <div id="hsp-home-main" className={mobile ? cls.rootMobile : cls.rootWeb}>
      <div className={mobile ? cls.searchBarMobile : cls.searchBarWeb}>
        <SearchBar />
      </div>
      <Carousel />
    </div>
  )
}
