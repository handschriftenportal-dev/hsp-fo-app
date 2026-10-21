import { AuthorityEntryType } from '../Main/Overview/HspObject/KeyValueTable/NormEntry'

export function isAuthorityEntry(
  data: string | AuthorityEntryType | undefined,
): data is AuthorityEntryType {
  return (
    typeof data === 'object' &&
    data !== null &&
    'value' in data &&
    'id' in data &&
    typeof data.value === 'string'
  )
}
