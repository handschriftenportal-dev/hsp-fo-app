import { useState } from 'react'
import { makeStyles } from 'tss-react/mui'

import Typography from '@mui/material/Typography'

import { useSearchTranslation } from 'src/components/search/utils'
import { BrokenImage } from 'src/components/shared/ResultView/Thumbnails/BrokenImage'
import { HspDigitized } from 'src/contexts/discovery'

const useStyles = makeStyles()((theme) => ({
  bold: { fontWeight: 'bold' },
  metadata: {
    marginTop: theme.spacing(2),
  },
  thumbnail: {
    display: 'flex',
    justifyContent: 'center',
  },
  thumbnailImg: {
    width: 200,
  },
}))

interface DigiCardContentProps {
  hspDigitized: Readonly<HspDigitized>
}

export function DigiCardContent(props: Readonly<DigiCardContentProps>) {
  const { hspDigitized } = props

  const { classes: cls } = useStyles()
  const [imageError, setImageError] = useState(false)
  const { searchT } = useSearchTranslation()

  return (
    <>
      {hspDigitized['thumbnail-url-display'] && (
        <div className={cls.thumbnail}>
          {imageError ? (
            <BrokenImage />
          ) : (
            <img
              className={cls.thumbnailImg}
              src={hspDigitized['thumbnail-url-display']}
              alt={searchT('resource', 'thumbnailImage')}
              onError={() => setImageError(true)}
            />
          )}
        </div>
      )}
      <div className={cls.metadata}>
        {(hspDigitized['digitization-institution-display']?.length ||
          hspDigitized['digitization-date-display']?.length) && (
          <Typography color="inherit" className={cls.bold}>
            {searchT('data', 'digitized')}
          </Typography>
        )}
        <Typography variant="body1" color="inherit">
          {hspDigitized['subtype-display'] &&
            searchT('data', 'subtype-display', hspDigitized['subtype-display'])}
        </Typography>
        <Typography variant="body1" color="inherit">
          {hspDigitized['digitization-institution-display']}
        </Typography>
        <Typography variant="body1" color="inherit">
          {hspDigitized['digitization-date-display'] &&
            new Date(hspDigitized['digitization-date-display']).getFullYear()}
        </Typography>
      </div>
    </>
  )
}
