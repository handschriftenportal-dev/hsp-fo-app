import { View } from 'src/components/shared'
import SearchFallback from 'src/components/shared/Skeletons/SearchFallback'

import { Filters } from './Filters'

export function ListView() {
  return <View FiltersComponent={<Filters />} Fallback={<SearchFallback />} />
}
