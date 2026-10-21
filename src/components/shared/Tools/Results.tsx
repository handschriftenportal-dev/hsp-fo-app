import clsx from 'clsx'
import { useAsyncValue } from 'react-router'
import { makeStyles } from 'tss-react/mui'

import Grid from '@mui/material/GridLegacy'

import { DiscoveryLoaderDataProps } from 'src/contexts/loader'

import { ResultCountsSkeleton } from '../Skeletons/ResultCountsSkeleton'
import { HitsShown } from './HitsShown'
import { ResultCounts } from './ResultCounts'

const useStyles = makeStyles()(() => ({
  results: {
    display: 'flex',
    alignItems: 'center',
  },
}))

export function Results({ className }: Readonly<{ className: string }>) {
  const { classes: cls } = useStyles()
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
