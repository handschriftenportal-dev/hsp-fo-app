export const discoveryEndpoint = '/api'

export interface HspDocument {
  id: string
  type:
    | 'hsp:object'
    | 'hsp:description'
    | 'hsp:description_retro'
    | 'hsp:digitized'
  'group-id': string
}

export interface HspCoreData {
  'dimensions-display': string[] | null
  'format-display': string[] | null
  'has-notation-display': string | null
  'idno-display': string | null
  'illuminated-display': string | null
  'language-display': string[] | null
  'leaves-count-display': string | null
  'material-display': string[] | null
  'object-type-display': string | null
  'orig-date-lang-display': string[] | null
  'orig-place-display': string[] | null
  'persistent-url-display': string | null
  'repository-display': string | null
  'settlement-display': string | null
  'status-display': string | null
  'title-display': string | null
}

export interface HspObject extends HspDocument, HspCoreData {
  type: 'hsp:object'
  'former-ms-identifier-display': string[] | null
  'settlement-authority-file-display': string[] | null
  'orig-place-authority-file-display': string[] | null
  'repository-authority-file-display': string[] | null
}

export interface HspDescription extends HspDocument, HspCoreData {
  type: 'hsp:description' | 'hsp:description_retro'
  'catalog-id-display': string | null
  'catalog-iiif-manifest-range-url-display': string | null
  'catalog-iiif-manifest-url-display': string | null
  'author-display': string[] | null
  'publish-year-display': number | null
}

export interface HspDigitized extends HspDocument {
  'digitization-date-display': string | null
  'digitization-institution-display': string | null
  'digitization-settlement-display': string | null
  'external-uri-display': string | null
  'issuing-date-display': string | null
  'manifest-uri-display': string | null
  'subtype-display': string | null
  'thumbnail-uri-display': string | null
  type: 'hsp:digitized'
}

export interface HspObjectGroup {
  hspObject: HspObject
  hspDescriptions: HspDescription[]
  hspDigitizeds: HspDigitized[]
}

export interface Facets {
  [facet: string]: {
    [value: string]: number
  }
}

export interface Highlighting {
  [id: string]: {
    [field: string]: string[]
  }
}

export interface Stats {
  [field: string]: {
    min: number | null
    max: number | null
    count: number
    missing: number
  }
}

export interface HspObjectsByQueryInput {
  q: string // a phrase to search for or a query in rsql syntax
  qf?: string[]
  start?: number
  rows?: number
  sort?: string
  fq?: string // the filter query as JSON string
  hl?: boolean
  isExtended?: boolean
}

export interface HspObjectsByQueryOutput {
  payload: HspObjectGroup[]
  metadata: {
    numFound: number
    start: number
    rows: number
    facets?: Facets
    highlighting?: Highlighting
    stats?: Stats
  }
}

export interface HspObjectByIdOutput {
  payload: HspObjectGroup
}

export interface CatalogItemProps {
  id: string
  type: 'hsp:catalog'
  'author-display': string[] | null
  // 'editor-display': string | null
  'publish-year-display': number | null
  'publisher-display': string[] | null
  'manifest-uri-display': string | null
  'thumbnail-uri-display': string | null
  'title-display': string | null
}

export interface CatalogsByQueryInput {
  start?: number
  rows?: number
}
export interface CatalogsByQueryOutput {
  payload: CatalogItemProps[]
  metadata: {
    numFound: number
    start: number
    rows: number
    facets?: Facets
    highlighting?: Highlighting
    stats?: Stats
  }
}

// /////////////////////////////////////////////////////////
// Endpoint: /authority-files
//
/// ////////////////////////////////////////////////////////

export interface AuthItemProps {
  preferredName: string
  variantName: string[] | null
  typeName: string
  identifier: null | string[]
  id: string
  gndId: string
}
