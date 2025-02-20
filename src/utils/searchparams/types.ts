/************************************************
 * Types and guards
 ************************************************/

export interface ParsedSearchParams {
  fromWorkspace?: boolean
  hspobjectid?: string
  q?: string
  qf?: string
  rows?: number
  start?: number
  sort?: string
  hl?: boolean
  fq?: FilterQuery
  isExtended?: boolean
  authorityfileid?: string
}

export interface FilterQuery {
  [fieldName: string]:
    | undefined
    | string
    | boolean
    | (string | boolean)[]
    | RangeFilterData
}

export interface RangeFilterData {
  from: number
  to: number
  missing?: boolean
  exact?: boolean
}

export interface ExtendedFieldsInfo {
  group: number
  groupCategory: number
  name: string
  type?: string
  values?: string[]
}
