import { ComparisonOperator, LogicOperator } from 'src/components/search/config'
import {
  ExtendedFieldsInfo,
  FilterQuery,
  ParsedSearchParams,
} from 'src/utils/searchparams'

export interface State {
  projectStatus: string
  sidebarOpen: boolean
  workspaceBadgeCount: number
  isMiradorMaximized?: boolean
}

export interface CatalogState {
  modifiedFilterQuery?: FilterQuery
  notificationOpen: boolean
}

export type HitListVariantType =
  | 'expanded'
  | 'collapsed'
  | 'keyData'
  | 'citations'

export type HitOpenActionType = {
  id: string
  citationOpen?: boolean
  open?: boolean
}

export interface SearchState {
  authorityId: string
  listView: {
    hitListVariant: HitListVariantType
    hits: { [id: string]: { citationOpen?: boolean; open?: boolean } }
  }
  modifiedFilterQuery?: FilterQuery
  searchField: string
  searchTerm: string
  searchParams: ParsedSearchParams
  selectedResources: ResourceInfo[]
  showFilterList: boolean
}

export interface CombinedSearchState {
  extendedSearch: GroupedExtendedSearchState
  search: SearchState
}

export interface ResourceInfo {
  type: 'hsp:description' | 'hsp:description_retro' | 'iiif:manifest'
  id: string
  query?: string
}
export interface WorkspaceResource {
  type: 'hsp:description' | 'hsp:description_retro' | 'iiif:manifest'
  id: string
  manifestId?: string
  query?: string
  permalink?: string
  kodId?: string
  canvasIndex?: number
}
export interface SearchListProps {
  comparisonOperator: ComparisonOperator
  searchField: string
  searchTerm: string | string[]
  id: string
}

export interface SearchGroup {
  elements: (SearchListProps | SearchGroup)[]
  groupId: string
  groupLogicOperators: LogicOperator[]
}

export interface GroupedExtendedSearchState {
  extendedSearchGroups: SearchGroup[]
  extendedFieldsInfo: ExtendedFieldsInfo[]
  hasFetchedExtFields: boolean
}
