import React from 'react'

import { useSearchTranslation } from 'src/components/search/utils'
import { CatalogItemProps, HspDigitized } from 'src/contexts/discovery'

interface ThumbnailImageProps {
  digi: HspDigitized | CatalogItemProps
}

export function ThumbnailImage(props: Readonly<ThumbnailImageProps>) {
  const { searchT } = useSearchTranslation()
  const { digi } = props

  return (
    <img
      alt={searchT('resource', 'thumbnailImage')}
      src={digi['thumbnail-uri-display'] as string}
      width={120}
    />
  )
}
