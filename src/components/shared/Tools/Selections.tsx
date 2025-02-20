import React from 'react'

import Grid from '@material-ui/core/Grid'

import { useGetLocationType } from 'src/utils/useGetLocationType'

import { HitListVariants } from './HitListVariants'
import { SortOptionSelect } from './SortOptionSelect'

export function Selections({ className }: Readonly<{ className: string }>) {
  const locationType = useGetLocationType()

  return (
    <Grid
      className={className}
      xs={12}
      sm={6}
      md={4}
      container
      item
      wrap="nowrap"
      justifyContent="space-between"
    >
      {locationType === 'objects' && (
        <>
          <SortOptionSelect />
          <HitListVariants />
        </>
      )}
    </Grid>
  )
}
