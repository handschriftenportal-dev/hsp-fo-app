import clsx from 'clsx'
import React from 'react'
import { Link } from 'react-router-dom'

import { Tooltip } from '@material-ui/core'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { DirectResourceLinks } from 'src/components/search/shared/DirectResourceLinks'
import { useSearchTranslation } from 'src/components/search/utils'
import { HspObjectGroup } from 'src/contexts/discovery'
import { toSearchParams, useParsedSearchParams } from 'src/utils/searchparams'

const useStyles = makeStyles((theme) => ({
  headRight: {
    display: 'flex',
    flexShrink: 0,
    marginRight: theme.spacing(8),
  },
  headLeft: {
    width: '75%',
  },
  link: {
    color: 'inherit',
    display: 'inline-block',
    textDecoration: 'none',
  },
  itemIcon: {
    verticalAlign: 'text-top',
    position: 'absolute',
  },
  arrowIcon: {
    color: theme.palette.primary.main,
    marginLeft: '5px',
  },
  headTypography: {
    width: '100%',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  expandLess: {},
  expandMore: {
    paddingTop: theme.spacing(1),
  },
}))
interface Props {
  hspObjectGroup: HspObjectGroup
  open: boolean
  toggle: () => void
}

export function SearchHitHead(props: Readonly<Props>) {
  const { open, hspObjectGroup, toggle } = props
  const { hspObject } = hspObjectGroup
  const cls = useStyles()
  const { searchT } = useSearchTranslation()
  const params = useParsedSearchParams()

  const linkToDetailView = `/search?${toSearchParams({
    ...params,
    hspobjectid: hspObject.id,
  })}`

  return (
    <>
      <div className={cls.headLeft}>
        <Tooltip title={searchT('overview', 'showKodOverview')}>
          <Link
            className={clsx(cls.link, 'addFocusableWithOutline')}
            to={linkToDetailView}
          >
            <Typography variant="h2" className={cls.headTypography}>
              {[
                hspObject['settlement-display'],
                hspObject['repository-display'],
                hspObject['idno-display'],
              ].join(', ')}
              <ListItemIcon className={cls.itemIcon}>
                <ArrowForwardIcon className={cls.arrowIcon} />
              </ListItemIcon>
            </Typography>
          </Link>
        </Tooltip>
      </div>
      <div className={cls.headRight}>
        <Hidden xsDown>
          {!open && (
            <DirectResourceLinks
              vertical={false}
              numOfDescriptions={hspObjectGroup.hspDescriptions.length}
              numOfDigitizeds={hspObjectGroup.hspDigitizeds.length}
              linkToDetailView={linkToDetailView}
            />
          )}
        </Hidden>
        <IconButton
          onClick={toggle}
          aria-label={
            open ? searchT('hit', 'collapse') : searchT('hit', 'expand')
          }
          className={open ? cls.expandLess : cls.expandMore}
        >
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </div>
    </>
  )
}
