import React from 'react'

import MuiLink from '@material-ui/core/Link'
import Tooltip from '@material-ui/core/Tooltip'
import { makeStyles } from '@material-ui/core/styles'

import { useSearchTranslation } from 'src/components/search/utils'
import { HspDigitized } from 'src/contexts/discovery'

import { ThumbnailImage } from './ThumbnailImage'

const useStyles = makeStyles(() => ({
  link: {
    padding: 0,
    margin: 0,
  },
  tooltip: {
    maxWidth: 450,
  },
}))

interface ExternalThumbnailProps {
  currentDigi: HspDigitized
}

export function ExternalThumbnail(props: Readonly<ExternalThumbnailProps>) {
  const { currentDigi } = props
  const cls = useStyles()
  const { searchT } = useSearchTranslation()
  return (
    <Tooltip
      title={searchT('resources', 'openDigitalImagesExternal') as string}
      className={cls.tooltip}
    >
      <MuiLink
        aria-label={searchT('resources', 'openDigitalImagesExternal')}
        className={cls.link}
        variant="body2"
        href={currentDigi['external-uri-display'] as string}
        target="_blank"
        tabIndex={0}
      >
        <ThumbnailImage digi={currentDigi} />
      </MuiLink>
    </Tooltip>
  )
}
