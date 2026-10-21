import Skeleton from '@mui/material/Skeleton'

import CatalogNotification from 'src/components/catalogs/Notification'

import { Grid } from '..'
import { ViewContent } from '../ResultView/ViewContent'

export default function CatalogFallback() {
  return (
    <>
      <Skeleton variant="rectangular" height={80} />
      <Grid>
        <Skeleton>
          <CatalogNotification />
        </Skeleton>
      </Grid>
      <Grid id="searchGrid">
        <ViewContent isSuspense={true} />
      </Grid>
    </>
  )
}
