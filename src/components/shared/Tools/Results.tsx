import clsx from 'clsx'
import React from 'react'
import { useAsyncValue } from 'react-router-dom'

import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'

import { DiscoveryLoaderDataProps } from 'src/contexts/loader'

import { ResultCountsSkeleton } from '../Skeletons/ResultCountsSkeleton'
import { HitsShown } from './HitsShown'
import { ResultCounts } from './ResultCounts'

const useStyles = makeStyles(() => ({
  results: {
    display: 'flex',
    alignItems: 'center',
  },
}))

export function Results({ className }: Readonly<{ className: string }>) {
  const cls = useStyles()
  const asyncValue = useAsyncValue() as DiscoveryLoaderDataProps | undefined

  return (
    <Grid
      className={clsx(className, cls.results)}
      xs={12}
      sm={12}
      md={4}
      container
      item
      wrap="nowrap"
    >
      {!asyncValue ? (
        <ResultCountsSkeleton />
      ) : (
        <>
          <ResultCounts />
          <HitsShown />
        </>
      )}
    </Grid>
  )
}
