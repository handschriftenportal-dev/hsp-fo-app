import { QueryClient, useQuery } from '@tanstack/react-query'

import { CatalogsByQueryInput } from 'src/contexts/discovery'
import { fetchCatalogsByQuery } from 'src/contexts/loader/catalogLoader'

export const useCatalogHighlighting = (
  catalogId: string,
  queryInput: CatalogsByQueryInput,
) => {
  return useQuery({
    queryKey: ['catalogHighlighting', catalogId],
    queryFn: () =>
      fetchCatalogsByQuery(
        { ...queryInput, rows: 1, hl: true } as CatalogsByQueryInput,
        new QueryClient(),
      ),
    enabled: false,
  })
}
