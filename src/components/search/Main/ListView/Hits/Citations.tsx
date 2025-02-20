import clsx from 'clsx'
import React from 'react'

import ButtonBase from '@material-ui/core/ButtonBase'
import Collapse from '@material-ui/core/Collapse'
import Icon from '@material-ui/core/Icon'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { useSearchTranslation } from 'src/components/search/utils'
import { Highlighting, HspObjectGroup } from 'src/contexts/discovery'

import { Citation } from './Citation'

const useStyles = makeStyles((theme) => ({
  root: {
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
  const cls = useStyles()
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
