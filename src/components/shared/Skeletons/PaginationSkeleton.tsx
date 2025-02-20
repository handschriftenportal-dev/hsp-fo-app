import React from 'react'

import useTheme from '@material-ui/core/styles/useTheme'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Pagination from '@material-ui/lab/Pagination'
import Skeleton from '@material-ui/lab/Skeleton'

export function PaginationSkeleton({
  className,
}: Readonly<{ className?: string }>) {
  const theme = useTheme()
  const smallerThanMd = useMediaQuery(theme.breakpoints.down('md'), {
    noSsr: true,
  })

  return (
    <div className={className}>
      <Skeleton>
        <Pagination
          siblingCount={5}
          count={5}
          size={smallerThanMd ? 'small' : 'medium'}
        />
      </Skeleton>
    </div>
  )
}
