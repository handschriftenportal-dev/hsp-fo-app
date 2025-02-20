import React from 'react'

import { View } from 'src/components/shared'

import { Filters } from './Filters'

export function ListView() {
  return <View FiltersComponent={<Filters />} />
}
