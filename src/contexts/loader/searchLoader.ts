import urlJoin from 'proper-url-join'
import { QueryClient } from 'react-query'
import { defer } from 'react-router-dom'

import { parseFromSearchParams } from 'src/utils/searchparams'

import {
  CatalogsByQueryOutput,
  HspObjectByIdOutput,
  HspObjectsByQueryInput,
  HspObjectsByQueryOutput,
  discoveryEndpoint,
  fetchJson,
} from '../discovery/'

// /////////////////////////////////////////////////////////
// Endpoint: /hspobjects/:id
//
// Takes an id as path variable and returns a hsp object
// and the related hsp descriptions
//
// 404 if nothing found
// /////////////////////////////////////////////////////////
async function fetchHspObjectById(
  hspObjectId: string,
  queryClient: QueryClient,
) {
  const hspObjectByIdEndpoint = urlJoin(
    discoveryEndpoint,
    '/hspobjects',
    hspObjectId ?? '',
  )
  const queryKeyObjectId = ['hspObjectById', hspObjectId]
  const queryFnHspObjectsId = () => fetchJson(fetch, hspObjectByIdEndpoint)

  return (
    queryClient.getQueryData(queryKeyObjectId) ??
    queryClient.fetchQuery(queryKeyObjectId, queryFnHspObjectsId)
  )
}

export async function fetchHspObjectsQuery(
  query: HspObjectsByQueryInput,
  queryClient: QueryClient,
) {
  const endpointHspObjects = urlJoin(discoveryEndpoint, '/hspobjects/search')
  const queryKeyHspObjects = ['hspObjectsByQuery', query]
  const queryFnHspObjects = () =>
    fetchJson<HspObjectsByQueryOutput>(fetch, endpointHspObjects, query)

  return (
    (queryClient.getQueryData(queryKeyHspObjects) as HspObjectsByQueryOutput) ??
    (await queryClient.fetchQuery(queryKeyHspObjects, queryFnHspObjects))
  )
}

export interface DiscoveryLoaderDataProps {
  searchResult: HspObjectsByQueryOutput | CatalogsByQueryOutput
  unfilteredResult: HspObjectsByQueryOutput
  resultList: HspObjectByIdOutput
}

/**
 * This loader performs different actions based on the URL structure:
 * - If the URL contains an hspobjectid, the loader returns a `resultList` based on the id.
 * - Otherwise, the loader returns a list of hspObjects based on query parameters,
 *   including unfiltered results for filters.
 */
export const searchLoader =
  (queryClient: QueryClient) =>
  async ({ request }: { request: Request }) => {
    const url = new URL(request.url)

    const searchParams = new URLSearchParams(url.search)
    const hspObjectId = searchParams.get('hspobjectid')

    if (hspObjectId && hspObjectId !== 'first' && hspObjectId !== 'last') {
      const hspObject = await fetchHspObjectById(hspObjectId, queryClient)
      return {
        resultList: hspObject,
      }
    } else {
      const params = parseFromSearchParams(searchParams)

      const query: HspObjectsByQueryInput = {
        q: params.q ?? '*',
        // N.B.: hsp-fo-discovery expects an array for qf; currently only supports a single value
        qf: params.qf ? [params.qf] : [],
        start: params.start ?? 0,
        rows: params.rows ?? 10,
        sort: params.sort ?? 'score-desc',
        fq: JSON.stringify(params.fq ?? {}),
        hl: params.hl ?? true,
        isExtended: params.isExtended === true,
      }

      const hspObjectsPromise = fetchHspObjectsQuery(query, queryClient)

      const unfilteredResultQuery = {
        ...query,
        start: 0,
        rows: 1,
      }
      const unfilteredResultPromise = fetchHspObjectsQuery(
        unfilteredResultQuery,
        queryClient,
      )

      return defer({
        searchResult: Promise.all([
          hspObjectsPromise,
          unfilteredResultPromise,
        ]).then(([hspObjects, unfilteredResult]) => ({
          searchResult: hspObjects,
          unfilteredResult,
        })),
      })
    }
  }
