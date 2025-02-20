import { HspObject } from 'src/contexts/discovery'

import { AuthorityEntryType } from '../Main/Overview/HspObject/KeyValueTable/NormEntry'

export interface KeyValueData {
  [key: string]: string | undefined | AuthorityEntryType
}

function getAuthorityField(field: string): string | null {
  if (field.includes('display')) {
    return field.replace('-display', '-authority-file-display')
  }
  return null
}

function getTranslatedValue(
  field: string,
  value: string | string[],
  hspObject: HspObject,
  searchT: (...args: [string, string, string | string[]]) => string,
): string | string[] | { value: string; id: string } | undefined {
  const authorityField = getAuthorityField(field)

  if (field === 'former-ms-identifier-display') {
    return value
  }

  if (authorityField && authorityField in hspObject) {
    const normIds = (hspObject as any)[authorityField]
    return normIds != null
      ? { value: searchT('data', field, value), id: normIds }
      : searchT('data', field, value)
  }

  return searchT('data', field, value)
}

export function makeKeyValueData(
  fields: string[],
  hspObject: HspObject,
  searchT: (...args: [string, string, string | string[]]) => string,
): KeyValueData {
  return fields.reduce((acc, field) => {
    const value = (hspObject as any)[field]
    const translatedField = searchT('data', field, '__field__')
    const translatedValue = getTranslatedValue(field, value, hspObject, searchT)

    return { ...acc, [translatedField]: translatedValue }
  }, {})
}
