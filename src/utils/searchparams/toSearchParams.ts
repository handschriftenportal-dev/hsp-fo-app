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

  if (authorityfileid) search.set('authorityfileid', authorityfileid)
  if (hspobjectid) search.set('hspobjectid', hspobjectid)
  if (fromWorkspace) search.set('fromWorkspace', 'true')
  if (q) search.set('q', q)
  if (hl) search.set('hl', 'true')
  if (start) search.set('start', start.toString())
  if (rows) search.set('rows', rows.toString())
  if (sort) search.set('sort', sort.toString())
  if (qf) search.set('qf', qf)
  if (fq && Object.values(fq).some((value) => value !== undefined))
    search.set('fq', JSON.stringify(fq))
  if (isExtended) search.set('isExtended', 'true')

  return search.toString()
}
