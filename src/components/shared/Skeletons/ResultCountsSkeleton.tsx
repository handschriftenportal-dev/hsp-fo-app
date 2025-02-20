import React from 'react'

import Typography from '@material-ui/core/Typography'
import Skeleton from '@material-ui/lab/Skeleton'

export function ResultCountsSkeleton({
  className,
}: Readonly<{ className?: string }>) {
  return (
    <div className={className}>
      <Typography variant="h1" aria-hidden="true">
        <Skeleton width={200} height={60} />
      </Typography>
    </div>
  )
}
