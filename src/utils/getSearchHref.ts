import { ParsedSearchParams, toSearchParams } from './searchparams'

export const getSearchHref = (searchParams: ParsedSearchParams) => {
  if (searchParams) {
    return `/search?${toSearchParams(searchParams)}`
  }

  return '/search'
}
