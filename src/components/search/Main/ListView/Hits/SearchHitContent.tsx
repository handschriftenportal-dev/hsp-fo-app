import { makeStyles } from 'tss-react/mui'

import Collapse from '@mui/material/Collapse'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import { hitKeyData } from 'src/components/search/config'
import { DirectResourceLinks } from 'src/components/search/shared/DirectResourceLinks'
import { useSearchTranslation } from 'src/components/search/utils'
import { Thumbnails } from 'src/components/shared/ResultView/Thumbnails'
import { HspObjectGroup } from 'src/contexts/discovery'
import { toSearchParams, useParsedSearchParams } from 'src/utils/searchparams'

const useStyles = makeStyles()((theme) => ({
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(2),
    paddingRight: theme.spacing(7.5),
    paddingLeft: theme.spacing(4),
  },
  textual: {
    display: 'flex',
    flexDirection: 'column',
    width: '60%',
  },
  details: {
    marginTop: theme.spacing(2),
  },
  thumbnailsMobile: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
}))

interface Props {
  hspObjectGroup: HspObjectGroup
  open: boolean
}

export function SearchHitContent(props: Readonly<Props>) {
  const { classes: cls } = useStyles()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { hspObjectGroup, open } = props
  const { hspObject } = hspObjectGroup
  const { searchT } = useSearchTranslation()

  const params = useParsedSearchParams()

  const linkToDetailView = `/search?${toSearchParams({
    ...params,
    hspobjectid: hspObject.id,
  })}`

  return (
    <Collapse in={open}>
      <div className={cls.content}>
        <div className={cls.textual}>
          <Typography variant="body2">{hspObject['title-display']}</Typography>
          <Typography className={cls.details} variant="body1">
            {hitKeyData
              .map((field) => searchT('data', field, hspObject[field]))
              .filter((x) => typeof x === 'string')
              .join(', ')}
          </Typography>
        </div>
        {!isMobile && (
          <Thumbnails hspDigitizeds={hspObjectGroup.hspDigitizeds} />
        )}
        {open && (
          <DirectResourceLinks
            vertical={true}
            numOfDescriptions={hspObjectGroup.hspDescriptions.length}
            numOfDigitizeds={hspObjectGroup.hspDigitizeds.length}
            linkToDetailView={linkToDetailView}
          />
        )}
      </div>
      {isMobile && (
        <div className={cls.thumbnailsMobile}>
          <Thumbnails hspDigitizeds={hspObjectGroup.hspDigitizeds} />
        </div>
      )}
    </Collapse>
  )
}
