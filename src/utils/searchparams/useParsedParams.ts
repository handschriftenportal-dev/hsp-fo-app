import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import { isBooleanArray } from '../isBooleanArray'
import { isRangeFilterData } from '../isRangeFilterData'
import { isStringArray } from '../isStringArray'
import { ParsedSearchParams } from './types'

/************************************************
 * Search params to parsed params and vice versa
 ************************************************/

function parseTrueStringParam(hl: string | null): ParsedSearchParams['hl'] {
  return hl ? hl === 'true' : undefined
}

function parseFilterQueryParam(fq: string | null): ParsedSearchParams['fq'] {
  if (fq === null) {
    return undefined
  }

  let _fq

  // fq must be a valid json string
  try {
    _fq = JSON.parse(fq)
  } catch (e) {
    return undefined
  }

  // fq must be an object
  if (typeof _fq !== 'object') {
    return undefined
  }

  // each entry of fq must be an string, a string|boolean array or range filter data
  if (
    !Object.values(_fq).every(
      (val) =>
        typeof val === 'string' ||
        isBooleanArray(val) ||
        isStringArray(val) ||
        isRangeFilterData(val),
    )
  ) {
    return undefined
  }

  return _fq
}

// needs to be || as otherwise routing logic is not working correctly
export function parseFromSearchParams(searchParams: URLSearchParams) {
  return {
    hspobjectid: searchParams.get('hspobjectid') || undefined,
    fromWorkspace: parseTrueStringParam(searchParams.get('fromWorkspace')),
    q: searchParams.get('q') || undefined,
    hl: parseTrueStringParam(searchParams.get('hl')),
    start: parseInt(searchParams.get('start') || '', 10) || undefined,
    rows: parseInt(searchParams.get('rows') || '', 10) || undefined,
    sort: searchParams.get('sort') || undefined,
    qf: searchParams.get('qf') || undefined,
    fq: parseFilterQueryParam(searchParams.get('fq')),
    isExtended: parseTrueStringParam(searchParams.get('isExtended')),
    authorityfileid: searchParams.get('authorityfileid') || undefined,
  }
}

export function useParsedSearchParams() {
  const [searchParams] = useSearchParams()

  return useMemo(() => {
    return parseFromSearchParams(searchParams)
  }, [searchParams])
}
