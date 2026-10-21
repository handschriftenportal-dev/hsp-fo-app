import { useEffect, useState } from 'react'
import { makeStyles } from 'tss-react/mui'

import { HspDescription, useHspCatalogById } from 'src/contexts/discovery'

import { useSearchTranslation } from '../../../utils'
import { CardInfo } from './DescCardInfo'

const useStyles = makeStyles<{ maxHeight: number }>()(
  (theme, { maxHeight }) => ({
    card: { display: 'flex' },
    info: { flex: 1, wordBreak: 'break-all' },
    img: {
      height: 'inherit',
      objectFit: 'contain',
      width: 'inherit',
    },
    imageDiv: {
      alignItems: 'center',
      display: 'flex',
      marginLeft: theme.spacing(1),
      height: maxHeight,
      maxWidth: 150,
    },
  }),
)

interface DescCardContentProps {
  desc: HspDescription
  isRetroDesc: boolean
  maxHeight: number
}

export function DescCardContent(props: Readonly<DescCardContentProps>) {
  const { desc, isRetroDesc, maxHeight } = props

  const { searchT } = useSearchTranslation()
  const { classes: cls } = useStyles({ maxHeight })

  const catalogId = isRetroDesc ? desc['catalog-id-display'] : null

  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const { data: catalog } = useHspCatalogById(catalogId)

  useEffect(() => {
    const catalogThumbnailDisplay = 'catalog-thumbnail-url-display'
    if (catalog?.[catalogThumbnailDisplay]) {
      setThumbnailUrl(catalog[catalogThumbnailDisplay])
    }
  }, [catalog])

  return (
    <div className={thumbnailUrl ? cls.card : ''}>
      <div className={thumbnailUrl ? cls.info : ''}>
        <CardInfo desc={desc} />
      </div>
      {thumbnailUrl && (
        <div className={cls.imageDiv}>
          <img
            className={cls.img}
            src={thumbnailUrl}
            alt={searchT('resource', 'thumbnailImage')}
          />
        </div>
      )}
    </div>
  )
}
