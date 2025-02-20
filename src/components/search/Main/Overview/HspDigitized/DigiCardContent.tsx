import React from 'react'

import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/core/styles/makeStyles'

import { useSearchTranslation } from 'src/components/search/utils'
import { HspDigitized } from 'src/contexts/discovery'

const useStyles = makeStyles((theme) => ({
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
  const { searchT } = useSearchTranslation()
  const { hspDigitized } = props
  const cls = useStyles()
  return (
    <>
      {hspDigitized['thumbnail-uri-display'] && (
        <div className={cls.thumbnail}>
          <img
            className={cls.thumbnailImg}
            src={hspDigitized['thumbnail-uri-display']}
            alt={searchT('resource', 'thumbnailImage')}
          />
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
