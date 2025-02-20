import React from 'react'

import { Hidden } from '@material-ui/core'
import makeStyles from '@material-ui/core/styles/makeStyles'

import { HitWrapper } from 'src/components/shared/ResultView/ResultHits/HitWrapper'
import { Thumbnails } from 'src/components/shared/ResultView/Thumbnails'
import { CatalogItemProps } from 'src/contexts/discovery'

import { CatalogContent } from './CatalogContent'
import { CatalogHead } from './CatalogHead'

const useStyles = makeStyles((theme) => ({
  catalogPaper: {
    backgroundColor: theme.palette.whiteSmoke.main,
  },
  catalogHit: {
    display: 'flex',
    justifyContent: 'space-between',
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
  },
  thumbnailsMobile: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
}))

interface Props {
  entry: CatalogItemProps
}

export function KeyDataCatalog({ entry }: Readonly<Props>) {
  const cls = useStyles()

  return (
    <HitWrapper className={cls.catalogPaper}>
      <>
        <div className={cls.catalogHit}>
          <div>
            <CatalogHead catalog={entry} />
            <CatalogContent catalog={entry} />
          </div>
          <Hidden xsDown>
            <Thumbnails catalog={entry} />
          </Hidden>
        </div>
        <Hidden smUp>
          <div className={cls.thumbnailsMobile}>
            <Thumbnails catalog={entry} />
          </div>
        </Hidden>
      </>
    </HitWrapper>
  )
}
