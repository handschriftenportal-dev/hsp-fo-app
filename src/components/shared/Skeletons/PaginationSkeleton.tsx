import Pagination from '@mui/material/Pagination'
import Skeleton from '@mui/material/Skeleton'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

export function PaginationSkeleton({
  className,
}: Readonly<{ className?: string }>) {
  const theme = useTheme()
  const smallerThanMd = useMediaQuery(theme.breakpoints.down('lg'), {
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
