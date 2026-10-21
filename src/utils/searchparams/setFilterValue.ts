import { FilterQuery } from './types'

/**
 * Returns a copy of `query` with `filterName` set to `selected`. When the
 * selection is empty - `undefined` (e.g. a disabled range filter) or an empty
 * array (the last facet value unchecked) - the key is removed instead of left
 * with an empty value, so the query object never carries dangling
 * `{ field: undefined }` entries that would later serialize to an empty `fq`.
 */
export const setFilterValue = (
  query: FilterQuery,
  filterName: string,
  selected: FilterQuery[keyof FilterQuery],
): FilterQuery => {
  const isEmpty =
    selected === undefined || (Array.isArray(selected) && selected.length === 0)
  if (isEmpty) {
    const { [filterName]: _removed, ...rest } = query
    return rest
  }
  return { ...query, [filterName]: selected }
}
