import React from 'react'

import Collapse from '@material-ui/core/Collapse'
import Hidden from '@material-ui/core/Hidden'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import { hitKeyData } from 'src/components/search/config'
import { DirectResourceLinks } from 'src/components/search/shared/DirectResourceLinks'
import { useSearchTranslation } from 'src/components/search/utils'
import { Thumbnails } from 'src/components/shared/ResultView/Thumbnails'
import { HspObjectGroup } from 'src/contexts/discovery'
import { toSearchParams, useParsedSearchParams } from 'src/utils/searchparams'

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingRight: theme.spacing(7.5),
    paddingLeft: theme.spacing(4),
  },
  textual: {
    display: 'flex',
    flexDirection: 'column',
    width: '60%',
  },
  title: {
    marginTop: theme.spacing(2),
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
  const cls = useStyles()
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
          <Typography className={cls.title} variant="body2">
            {hspObject['title-display']}
          </Typography>
          <Typography className={cls.details} variant="body1">
            {hitKeyData
              .map((field) => searchT('data', field, hspObject[field]))
              .filter((x) => typeof x === 'string')
              .join(', ')}
          </Typography>
        </div>
        <Hidden xsDown>
          <Thumbnails hspDigitizeds={hspObjectGroup.hspDigitizeds} />
        </Hidden>
        {open && (
          <DirectResourceLinks
            vertical={true}
            numOfDescriptions={hspObjectGroup.hspDescriptions.length}
            numOfDigitizeds={hspObjectGroup.hspDigitizeds.length}
            linkToDetailView={linkToDetailView}
          />
        )}
      </div>
      <Hidden smUp>
        <div className={cls.thumbnailsMobile}>
          <Thumbnails hspDigitizeds={hspObjectGroup.hspDigitizeds} />
        </div>
      </Hidden>
    </Collapse>
  )
}
