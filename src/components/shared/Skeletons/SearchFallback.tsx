import { Grid } from '..'
import { ViewContent } from '../ResultView/ViewContent'

export default function CatalogFallback() {
  return (
    <>
      <Grid id="searchGrid">
        <ViewContent isSuspense={true} />
      </Grid>
    </>
  )
}
