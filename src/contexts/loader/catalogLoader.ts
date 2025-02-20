import urlJoin from 'proper-url-join'
import { QueryClient } from 'react-query'
import { defer } from 'react-router-dom'

import { parseFromSearchParams } from 'src/utils/searchparams'

import {
  CatalogsByQueryInput,
  CatalogsByQueryOutput,
  discoveryEndpoint,
  fetchJson,
} from '../discovery/'

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
    (await queryClient.fetchQuery(queryCatalogs, queryFnHspObjects))
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

    const { start, rows, fq } = parseFromSearchParams(searchParams)

    const query = {
      q: '*',
      start: start ?? 0,
      rows: rows ?? 10,
      fq: JSON.stringify(fq ?? {}),
    } as CatalogsByQueryInput

    const catalogsPromise = fetchCatalogsByQuery(query, queryClient)

    return defer({
      searchResult: catalogsPromise.then((catalogs) => {
        return {
          searchResult: {
            ...catalogs,
          },
        }
      }),
    })
  }
