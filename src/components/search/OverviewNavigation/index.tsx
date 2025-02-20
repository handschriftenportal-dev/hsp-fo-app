import clsx from 'clsx'
import React, { useCallback, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'

import { useHspObjectsByQuery } from 'src/contexts/discovery/'
import { toSearchParams, useParsedSearchParams } from 'src/utils/searchparams'

import BackButton from '../shared/BackButton'
import { useSearchTranslation } from '../utils'
import { getNextLocation, getPrevLocation } from './navigationUtils'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  mobileNavButtonRoot: {
    minWidth: 0,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  mobileNavButtonIcon: {
    margin: 0,
  },
  count: {
    textAlign: 'center',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  currentPage: {
    fontWeight: 700,
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
}))

interface Props {
  className?: string
}

export function OverviewNavigation({ className }: Readonly<Props>) {
  const cls = useStyles()
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('xs'), { noSsr: true })
  const params = useParsedSearchParams()
  const { searchT } = useSearchTranslation()

  const navigate = useNavigate()
  const location = useLocation()
  const newParams = { ...params, rows: 50 }
  const {
    data: resultList,
    error: resultListError,
    isIdle,
  } = useHspObjectsByQuery(newParams)

  const prevInput = useCallback(
    (prevElement) => {
      if (prevElement && location.hash === '#prev') {
        prevElement.focus()
      }
    },
    [location.hash],
  )

  const nextInput = useCallback(
    (nextElement) => {
      if (nextElement && location.hash === '#next') {
        nextElement.focus()
      }
    },
    [location.hash],
  )

  useEffect(() => {
    if (!resultList) {
      return
    }

    if (params.hspobjectid === 'first') {
      const newParams = {
        ...params,
        hspobjectid: resultList.payload[0].hspObject.id,
      }
      navigate(`/search?${toSearchParams(newParams)}#next`)
    }
    if (params.hspobjectid === 'last') {
      const newParams = {
        ...params,
        hspobjectid:
          resultList.payload[resultList.payload.length - 1].hspObject.id,
      }

      navigate(`/search?${toSearchParams(newParams)}#prev`)
    }
  }, [resultList])

  if (isIdle) {
    return null
  }

  if (resultListError) {
    return null
  }

  if (!resultList) {
    return null
  }

  // Ok, we received the result list.
  // Now we check if hspobjectid is set to 'first' or 'last'.
  // If so, we return null because the useEffect hook will make a redirect
  // with the correct substitution for 'last' or 'first'

  if (params.hspobjectid === 'first' || params.hspobjectid === 'last') {
    return null
  }

  const hspObjectIds = resultList.payload.map((group) => group.hspObject.id)
  const currentIndex = hspObjectIds.findIndex((id) => id === params.hspobjectid)

  // If the target hsp object does not exist on the result list
  // we return null because navigation can not be performed.
  if (currentIndex === -1) {
    return null
  }
  const backParams = {
    ...params,
    hspobjectid: undefined,
  }

  const nextLocation = getNextLocation(
    params,
    resultList,
    hspObjectIds,
    currentIndex,
  )

  const prevLocation = getPrevLocation(
    params,
    resultList,
    hspObjectIds,
    currentIndex,
  )

  return (
    <div id="resultNav" tabIndex={-1} className={clsx(cls.root, className)}>
      <BackButton
        backParams={backParams}
        preventScrollReset={false}
        btnType="back"
      />
      <Button
        component={Link}
        classes={{
          root: mobile ? cls.mobileNavButtonRoot : undefined,
          startIcon: mobile ? cls.mobileNavButtonIcon : undefined,
        }}
        to={prevLocation}
        ref={prevInput}
        startIcon={<ArrowBackIcon />}
        disabled={!prevLocation}
        variant="contained"
      >
        {!mobile && searchT('buttonPrevious')}
      </Button>
      <div className={cls.count}>
        <Typography className={cls.currentPage} display="inline">
          {(resultList.metadata.start + 1 + currentIndex).toString()}
        </Typography>
        <Typography display="inline">
          &#32;
          {searchT('overview', mobile ? 'ofMobile' : 'ofDesktop')}
          &#32;
          {resultList.metadata.numFound.toString()}
        </Typography>
      </div>
      <Button
        color="primary"
        component={Link}
        classes={{
          root: mobile ? cls.mobileNavButtonRoot : undefined,
          startIcon: mobile ? cls.mobileNavButtonIcon : undefined,
        }}
        to={nextLocation}
        ref={nextInput}
        startIcon={<ArrowForwardIcon />}
        disabled={!nextLocation}
        variant="contained"
      >
        {!mobile && searchT('buttonNext')}
      </Button>
    </div>
  )
}
