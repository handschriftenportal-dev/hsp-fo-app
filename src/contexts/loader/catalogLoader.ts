import { QueryClient } from '@tanstack/react-query'
import urlJoin from 'proper-url-join'

import { parseFromSearchParams } from 'src/utils/searchparams'

import {
  CatalogsByQueryInput,
  CatalogsByQueryOutput,
  discoveryEndpoint,
  fetchJson,
} from '../discovery/'
import { streamed } from './streamed'

const ENDPOINT_CATALOGS = urlJoin(discoveryEndpoint, '/catalogs/search')

// /////////////////////////////////////////////////////////
// Endpoint: /catalogs
//
// Returns a list of catalogs
//
/// ////////////////////////////////////////////////////////

export async function fetchCatalogsByQuery(
  query: CatalogsByQueryInput,
  queryClient: QueryClient,
) {
  const queryFnHspObjects = () =>
    fetchJson<CatalogsByQueryOutput>(fetch, ENDPOINT_CATALOGS, query)
  const queryCatalogs = ['catalogsByQuery', query]

  return (
    (queryClient.getQueryData(queryCatalogs) as CatalogsByQueryOutput) ??
    (await queryClient.fetchQuery({
      queryKey: queryCatalogs,
      queryFn: queryFnHspObjects,
    }))
  )
}

/**
 * Fetches all catalogs by query.
 */
export const catalogLoader =
  (queryClient: QueryClient) =>
  async ({ request }: { request: Request }) => {
    const url = new URL(request.url)
    const searchParams = new URLSearchParams(url.search)

    const { start, rows, fq, q } = parseFromSearchParams(searchParams)

    const query = {
      q: q ?? '*',
      start: start ?? 0,
      rows: rows ?? 10,
      fq: JSON.stringify(fq ?? {}),
      hl: false,
    } as CatalogsByQueryInput

    const catalogsPromise = fetchCatalogsByQuery(query, queryClient)

    return {
      searchResult: streamed(
        catalogsPromise.then((catalogs) => {
          return {
            searchResult: {
              ...catalogs,
            },
          }
        }),
      ),
    }
  }
