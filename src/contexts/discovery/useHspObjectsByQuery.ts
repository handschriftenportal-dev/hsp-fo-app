import urlJoin from 'proper-url-join'
import { useQuery } from 'react-query'

import { ParsedSearchParams } from 'src/utils/searchparams'

import {
  HspObjectsByQueryInput,
  HspObjectsByQueryOutput,
  discoveryEndpoint,
} from './'
import { fetchJson } from './fetchJson'

// /////////////////////////////////////////////////////////
// Endpoint: /hspobjects
//
// Takes a query string and returns a list of hsp objects
// and related hsp descriptions, based on a set of query parameters.
// Uses react-query to cache the result.
/// ////////////////////////////////////////////////////////

export function useHspObjectsByQuery(params: ParsedSearchParams) {
  const api = urlJoin(discoveryEndpoint, '/hspobjects/search')

  // Because caching with react-query works by checking deep equality of the keys passed ('hspObjectByQuery' and 'query' in that case)
  // we need to make shure that we always have the same shape of keys for the same resources that we request.
  // That means, even though the API of the discovery service allows to omit some parameters and uses defaults we will be strict
  // with composing the query.
  const query: HspObjectsByQueryInput = {
    q: params.q ?? '*',
    // N.B.: hsp-fo-discovery expects an array for qf; currently only supports a single value
    qf: params.qf ? [params.qf] : [],
    start: params.start ?? 0,
    rows: params.rows ?? 10,
    sort: params.sort ?? 'score-desc',
    fq: JSON.stringify(params.fq ?? {}),
    hl: params.hl ?? true,
    // hl: params.hl === undefined ? true : params.hl,
    isExtended: params.isExtended === true,
  }

  return useQuery<HspObjectsByQueryOutput, Error>(
    ['hspObjectsByQuery', query],
    () => fetchJson<HspObjectsByQueryOutput>(fetch, api, query),
    { keepPreviousData: true },
  )
}
