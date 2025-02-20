import { ParsedSearchParams } from './types'

export function toSearchParams(params: ParsedSearchParams): string {
  const search = new URLSearchParams()
  const {
    hspobjectid,
    fromWorkspace,
    q,
    hl,
    start,
    rows,
    qf,
    fq,
    sort,
    isExtended,
    authorityfileid,
  } = params ?? {}

  authorityfileid && search.set('authorityfileid', authorityfileid)
  hspobjectid && search.set('hspobjectid', hspobjectid)
  fromWorkspace && search.set('fromWorkspace', 'true')
  q && search.set('q', q)
  hl && search.set('hl', 'true')
  start && search.set('start', start.toString())
  rows && search.set('rows', rows.toString())
  sort && search.set('sort', sort.toString())
  qf && search.set('qf', qf)
  fq && search.set('fq', JSON.stringify(fq))
  isExtended && search.set('isExtended', 'true')

  return search.toString()
}
