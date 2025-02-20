import { RangeFilterData } from './searchparams'

export function isRangeFilterData(item: any): item is RangeFilterData {
  return (
    typeof item === 'object' &&
    typeof item.from === 'number' &&
    typeof item.to === 'number'
  )
}
