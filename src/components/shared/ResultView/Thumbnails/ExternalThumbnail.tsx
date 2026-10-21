import { makeStyles } from 'tss-react/mui'

import MuiLink from '@mui/material/Link'

import { useSearchTranslation } from 'src/components/search/utils'
import { HspDigitized } from 'src/contexts/discovery'
import { Tooltip } from 'src/utils/Tooltip'

import { ThumbnailImage } from './ThumbnailImage'

const useStyles = makeStyles()(() => ({
  link: {
    padding: 0,
    margin: 0,
    // Was previously passed as the Tooltip's `className`, which MUI applies to
    // the child trigger (not the bubble); kept on the child to preserve layout.
    maxWidth: 450,
  },
}))

interface ExternalThumbnailProps {
  currentDigi: HspDigitized
}

export function ExternalThumbnail(props: Readonly<ExternalThumbnailProps>) {
  const { currentDigi } = props
  const { classes: cls } = useStyles()
  const { searchT } = useSearchTranslation()
  return (
    <Tooltip
      title={searchT('resources', 'openDigitalImagesExternal') as string}
    >
      <MuiLink
        aria-label={searchT('resources', 'openDigitalImagesExternal')}
        className={cls.link}
        variant="body2"
        href={currentDigi['external-url-display'] as string}
        target="_blank"
        tabIndex={0}
      >
        <ThumbnailImage digi={currentDigi} />
      </MuiLink>
    </Tooltip>
  )
}
