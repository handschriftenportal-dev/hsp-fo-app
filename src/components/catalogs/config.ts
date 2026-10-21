import { CatalogItemProps } from 'src/contexts/discovery'

export const hitKeyDataCatalog: (keyof CatalogItemProps)[] = [
  'catalog-author-display',
  'catalog-editor-display',
  'catalog-publisher-display',
  'catalog-publish-year-display',
  'catalog-repository-display',
  'id',
  'catalog-fulltext-display',
  'catalog-external-url-display',
]

export const exludedIfEmptyFields = [
  'catalog-editor-display',
  'catalog-external-url-display',
  'catalog-repository-display',
]

export const filterTypes: Record<string, string> = {
  'catalog-author-facet': 'list',
  'catalog-repository-facet': 'list',
  // 'fulltext-facet':'list',
  // 'publisher-facet': 'list',
  'catalog-publish-year-facet': 'range',
}
export const orderCatalogFacets = [
  // 'publisher-facet',
  'catalog-repository-facet',
  'catalog-author-facet',
  'catalog-publish-year-facet',
]
