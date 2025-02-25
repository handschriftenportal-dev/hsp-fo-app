import React, { useEffect } from 'react'
import { useLoaderData, useLocation } from 'react-router-dom'

import makeStyles from '@material-ui/core/styles/makeStyles'

import { Grid } from 'src/components/shared/Grid'
import { DiscoveryLoaderDataProps } from 'src/contexts/loader'

import { useSearchTranslation } from '../../utils'
import { HspDescriptions } from './HspDescription'
import { HspDigitizeds } from './HspDigitized'
import { HspObjects } from './HspObject'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    scrollMarginTop: '350px',
  },
  hspObject: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  hspDescription: {
    background: theme.palette.warmGrey.main,
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
    [theme.breakpoints.only('xs')]: {
      paddingLeft: theme.spacing(3.5),
      paddingRight: theme.spacing(3.5),
    },
  },
  hspDigital: {
    background: 'black',
    color: 'white',
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
    [theme.breakpoints.only('xs')]: {
      paddingLeft: theme.spacing(3.5),
      paddingRight: theme.spacing(3.5),
    },
  },
}))

export function Overview() {
  const cls = useStyles()
  const { resultList } = useLoaderData() as DiscoveryLoaderDataProps

  const { searchT } = useSearchTranslation()

  const { hash } = useLocation()

  useEffect(() => {
    if (hash === '#hsp-descriptions') {
      const desc = document.getElementById('hsp-descriptions')
      desc?.scrollIntoView()
      desc?.focus()
    } else if (hash === '#hsp-digitizeds') {
      const digi = document.getElementById('hsp-digitizeds')
      digi?.scrollIntoView()
      digi?.focus()
    } else {
      window.scrollTo(0, 0)
    }
  }, [resultList, hash])

  // When the user clicks on the resource icons a new route will be dispatched with the
  // hash set to either '#hsp-description' or '#hsp-digitizeds' triggering the useEffect
  // above which scrolls to the wanted section. If the hash is already set to the clicked
  // resource type than no route will be dispatched and the useEffect will not be triggered.
  // In that case the following function will manage the scrolling.
  function handleResourceInfoClicked(
    resourceType: 'hsp-descriptions' | 'hsp-digitizeds',
  ) {
    if (hash === '#hsp-descriptions' && resourceType === 'hsp-descriptions') {
      const desc = document.getElementById('manuscriptDescriptions')
      desc?.scrollIntoView()
    } else if (
      hash === '#hsp-digitizeds' &&
      resourceType === 'hsp-digitizeds'
    ) {
      const digi = document.getElementById('digitalImages')
      digi?.scrollIntoView()
    }
  }

  if (!resultList)
    return <p data-testid="discovery-overview">{searchT('loading')}</p>

  return (
    <div className={cls.root}>
      <div className={cls.hspObject}>
        <Grid>
          <HspObjects
            hspObject={resultList.payload.hspObject}
            numOfDescriptions={resultList.payload.hspDescriptions.length}
            numOfDigitizeds={resultList.payload.hspDigitizeds.length}
            onResourceInfoClicked={handleResourceInfoClicked}
          />
        </Grid>
      </div>
      <div className={cls.hspDescription}>
        <Grid>
          <HspDescriptions
            hspDescriptions={resultList.payload.hspDescriptions}
          />
        </Grid>
      </div>
      <div className={cls.hspDigital}>
        <Grid>
          <HspDigitizeds hspDigitizeds={resultList.payload.hspDigitizeds} />
        </Grid>
      </div>
    </div>
  )
}
