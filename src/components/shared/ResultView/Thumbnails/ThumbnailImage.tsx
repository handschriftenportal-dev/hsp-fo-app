import { useState } from 'react'
import { useLocation } from 'react-router'
import { makeStyles } from 'tss-react/mui'

import { useSearchTranslation } from 'src/components/search/utils'
import { CatalogItemProps, HspDigitized } from 'src/contexts/discovery'

import { BrokenImage } from './BrokenImage'

const useStyles = makeStyles()((theme) => ({
  searchOverview: {
    border: `${theme.palette.liver.light} thin`,
    borderStyle: 'dotted',
  },
}))

interface ThumbnailImageProps {
  digi: HspDigitized | CatalogItemProps
}

export function ThumbnailImage(props: Readonly<ThumbnailImageProps>) {
  const { digi } = props

  const [imageError, setImageError] = useState(false)
  const { classes: cls } = useStyles()
  const location = useLocation()
  const { searchT } = useSearchTranslation()

  const isCatalogView = location.pathname === '/catalogs'

  const src = isCatalogView
    ? (digi as CatalogItemProps)['catalog-thumbnail-url-display']
    : (digi as HspDigitized)['thumbnail-url-display']

  return imageError || !src ? (
    <BrokenImage className={isCatalogView ? '' : cls.searchOverview} />
  ) : (
    <img
      alt={searchT('resource', 'thumbnailImage')}
      src={src as string}
      width={120}
      onError={() => setImageError(true)}
    />
  )
}
