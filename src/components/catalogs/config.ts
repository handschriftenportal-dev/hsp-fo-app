import { CatalogItemProps } from 'src/contexts/discovery'

export const hitKeyDataCatalog: (keyof CatalogItemProps)[] = [
  'author-display',
  // 'editor-display',
  'publisher-display',
  'publish-year-display',
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
  // TODO: 20703 'fulltext-facet',
]
