import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'

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
