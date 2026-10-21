import { useQuery } from '@tanstack/react-query'
import urlJoin from 'proper-url-join'

import { CatalogItemProps } from '.'
import { discoveryEndpoint, fetchJson } from '../discovery'

export function useHspCatalogById(id: string | null) {
  const url = urlJoin(discoveryEndpoint, '/catalogs', id ?? '')

  return useQuery<CatalogItemProps, Error>({
    queryKey: ['hspCatalogById', id],
    queryFn: () => fetchJson(fetch, url),
    enabled: !!id,
  })
}
