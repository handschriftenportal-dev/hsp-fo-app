import React from 'react'

import { CatalogItemProps, HspDigitized } from 'src/contexts/discovery'

import { CatalogThumbnail } from './CatalogThumbnail'
import { SearchThumbnail } from './SearchThumbnail'

interface Props {
  hspDigitizeds?: HspDigitized[]
  catalog?: CatalogItemProps
}

export function Thumbnails(props: Readonly<Props>) {
  const { hspDigitizeds, catalog } = props

  if (hspDigitizeds) {
    return <SearchThumbnail hspDigitizeds={hspDigitizeds} />
  } else if (catalog) {
    return <CatalogThumbnail catalog={catalog} />
  }
  return null
}
