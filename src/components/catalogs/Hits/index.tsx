import { makeStyles } from 'tss-react/mui'

import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import { HitWrapper } from 'src/components/shared/ResultView/ResultHits/HitWrapper'
import { Thumbnails } from 'src/components/shared/ResultView/Thumbnails'
import { CatalogItemProps } from 'src/contexts/discovery'

import { CatalogHead } from './CatalogHead'
import { CatalogContent } from './Content/CatalogContent'

const useStyles = makeStyles()((theme) => ({
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
  index?: number
}

export function KeyDataCatalog({ entry, index }: Readonly<Props>) {
  const { classes: cls } = useStyles()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <HitWrapper className={cls.catalogPaper}>
      <>
        <div className={cls.catalogHit}>
          <div>
            <CatalogHead catalog={entry} />
            <CatalogContent catalog={entry} index={index} />
          </div>
          {!isMobile && <Thumbnails catalog={entry} />}
        </div>
        {isMobile && (
          <div className={cls.thumbnailsMobile}>
            <Thumbnails catalog={entry} />
          </div>
        )}
      </>
    </HitWrapper>
  )
}
