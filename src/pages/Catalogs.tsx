import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router'

import { CatalogFilters } from 'src/components/catalogs/Filters'
import CatalogNotification from 'src/components/catalogs/Notification'
import { View } from 'src/components/shared'
import CatalogFallback from 'src/components/shared/Skeletons/CatalogFallback'
import { catalogActions } from 'src/contexts/actions/catalogActions'
import { useSetupModulesForPage } from 'src/contexts/modules'
import { useTrackPageView } from 'src/contexts/tracking'
import {
  ParsedSearchParams,
  useParsedSearchParams,
} from 'src/utils/searchparams'

export function Catalogs() {
  const dispatch = useDispatch()
  const { fq }: ParsedSearchParams = useParsedSearchParams()
  const location = useLocation()

  useSetupModulesForPage()
  useTrackPageView('Catalogs')

  useEffect(() => {
    if (location.pathname === '/catalogs') {
      dispatch(catalogActions.setModifiedFilterQuery(fq ?? {}))
    }
  }, [fq])

  return (
    <View
      FiltersComponent={<CatalogFilters />}
      NotificationComponent={<CatalogNotification />}
      Fallback={<CatalogFallback />}
    />
  )
}
export default Catalogs
