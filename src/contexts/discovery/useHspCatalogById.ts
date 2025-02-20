import urlJoin from 'proper-url-join'
import { useQuery } from 'react-query'

import { CatalogItemProps } from '.'
import { discoveryEndpoint, fetchJson } from '../discovery'

export function useHspCatalogById(id: string | null) {
  const url = urlJoin(discoveryEndpoint, '/catalogs', id ?? '')

  return useQuery<CatalogItemProps, Error>(
    ['hspCatalogById', id],
    () => fetchJson(fetch, url),
    // The 'id' is nescesary to perfom the request. We disable the request
    // if it is undefined. If this is the case the 'isIdle' prop of the return object will be 'true'
    { enabled: !!id },
  )
}
