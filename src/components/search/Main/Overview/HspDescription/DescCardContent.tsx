import React, { useEffect, useState } from 'react'

import makeStyles from '@material-ui/core/styles/makeStyles'

import { HspDescription, useHspCatalogById } from 'src/contexts/discovery'

import { useSearchTranslation } from '../../../utils'
import { CardInfo } from './DescCardInfo'

const useStyles = makeStyles((theme) => ({
  card: { display: 'flex' },
  info: { flex: 1, wordBreak: 'break-all' },
  img: {
    height: 'inherit',
    objectFit: 'contain',
    width: 'inherit',
  },
  imageDiv: (props: { maxHeight: number }) => ({
    alignItems: 'center',
    display: 'flex',
    marginLeft: theme.spacing(1),
    height: props.maxHeight,
    maxWidth: 150,
  }),
}))

interface DescCardContentProps {
  desc: HspDescription
  isRetroDesc: boolean
  maxHeight: number
}

export function DescCardContent(props: Readonly<DescCardContentProps>) {
  const { desc, isRetroDesc, maxHeight } = props

  const { searchT } = useSearchTranslation()
  const cls = useStyles({ maxHeight })

  const catalogId = isRetroDesc ? desc['catalog-id-display'] : null

  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const { data: catalog } = useHspCatalogById(catalogId)

  useEffect(() => {
    if (catalog?.['thumbnail-uri-display']) {
      setThumbnailUrl(catalog['thumbnail-uri-display'])
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
