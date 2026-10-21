import clsx from 'clsx'
import { makeStyles } from 'tss-react/mui'

import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ButtonBase from '@mui/material/ButtonBase'
import Collapse from '@mui/material/Collapse'
import Icon from '@mui/material/Icon'
import Typography from '@mui/material/Typography'

import { useSearchTranslation } from 'src/components/search/utils'
import { Highlighting, HspObjectGroup } from 'src/contexts/discovery'

import { Citation } from './Citation'

const useStyles = makeStyles()((theme) => ({
  root: {
    // Own stacking context so the card Fabs (z-index 1050) stay scoped here
    // and below the open filter drawer (z-index 100) instead of over it.
    position: 'relative',
    zIndex: 1,
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
    backgroundColor: theme.palette.warmGrey.main,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
  headline: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1),
    cursor: 'pointer',
    width: '100%',
  },
  content: {
    width: '75%',
    padding: theme.spacing(2),
    paddingTop: theme.spacing(0),
  },
  citation: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  headRight: {
    marginRight: theme.spacing(8),
    padding: theme.spacing(0.5),
  },
  citationHit: {
    padding: theme.spacing(1),
  },
}))

interface Props {
  className?: string
  open: boolean
  hspObjectGroup: HspObjectGroup
  highlighting: Highlighting
  toggle: () => void
}

export function Citations(props: Readonly<Props>) {
  const { className, hspObjectGroup, highlighting, open, toggle } = props
  const { classes: cls } = useStyles()
  const { searchT } = useSearchTranslation()

  const docs = [hspObjectGroup.hspObject, ...hspObjectGroup.hspDescriptions]

  return (
    <div
      data-testid="discovery-list-view-hits-citations"
      className={clsx(cls.root, className)}
    >
      <ButtonBase className={cls.headline} onClick={toggle}>
        <Typography variant="body1" className={cls.citationHit}>
          {!open && searchT('hit', 'showResultContext')}
        </Typography>
        <div className={cls.headRight}>
          <Icon
            aria-label={
              open ? searchT('hit', 'collapse') : searchT('hit', 'expand')
            }
          >
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Icon>
        </div>
      </ButtonBase>
      <Collapse in={open}>
        <div className={cls.content}>
          {docs.map((doc) => (
            <Citation
              className={cls.citation}
              key={doc.id}
              document={doc}
              highlighting={highlighting}
            />
          ))}
        </div>
      </Collapse>
    </div>
  )
}
