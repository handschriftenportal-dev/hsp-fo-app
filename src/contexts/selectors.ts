import { CombinedState } from './reducer/rootReducer'
import { CombinedSearchState } from './types'

export const catalogSelectors = {
  getCatalogModifiedFilterQuery: (state: CombinedState) =>
    state.catalogs.modifiedFilterQuery,
  getCatalogNotificationOpen: (state: CombinedState) =>
    state.catalogs.notificationOpen,
}

export const selectors = {
  getSidebarOpen: (state: CombinedState) => state.app.sidebarOpen,
  getWorkspaceBadgeCount: (state: CombinedState) =>
    state.app.workspaceBadgeCount,
  getProjectStatus: (state: CombinedState) => state.app.projectStatus,
  getIsMiradorMaximized: (state: CombinedState) => state.app.isMiradorMaximized,
}

export const searchSelectors = {
  getModifiedFilterQuery: (state: CombinedSearchState) =>
    state.search.modifiedFilterQuery,
  getHitListVariant: (state: CombinedSearchState) =>
    state.search.listView.hitListVariant,
  getHits: (state: CombinedSearchState) => state.search.listView.hits,
  getSelectedResources: (state: CombinedSearchState) =>
    state.search.selectedResources,
  getAuthorityId: (state: CombinedSearchState) => state.search.authorityId,
  getShowFilterList: (state: CombinedSearchState) =>
    state.search.showFilterList,
  getSearchTerm: (state: CombinedSearchState) => state.search.searchTerm,
  getSearchField: (state: CombinedSearchState) => state.search.searchField,
  getSearchParams: (state: CombinedSearchState) => state.search.searchParams,
}

export const extSearchSelectors = {
  getExtendedFieldInfo: (state: CombinedSearchState) =>
    state.extendedSearch.extendedFieldsInfo,
  getHasFetchedExtFields: (state: CombinedSearchState) =>
    state.extendedSearch.hasFetchedExtFields,
  getExtendedSearchGroups: (state: CombinedSearchState) =>
    state.extendedSearch.extendedSearchGroups,
}
