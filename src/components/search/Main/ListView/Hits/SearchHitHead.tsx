import clsx from 'clsx'
import { Link } from 'react-router'
import { makeStyles } from 'tss-react/mui'

import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import { DirectResourceLinks } from 'src/components/search/shared/DirectResourceLinks'
import { useSearchTranslation } from 'src/components/search/utils'
import { HspObjectGroup } from 'src/contexts/discovery'
import { Tooltip } from 'src/utils/Tooltip'
import { toSearchParams, useParsedSearchParams } from 'src/utils/searchparams'

const useStyles = makeStyles()((theme) => ({
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
  const { classes: cls } = useStyles()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
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
        {!isMobile && !open && (
          <DirectResourceLinks
            vertical={false}
            numOfDescriptions={hspObjectGroup.hspDescriptions.length}
            numOfDigitizeds={hspObjectGroup.hspDigitizeds.length}
            linkToDetailView={linkToDetailView}
          />
        )}
        <IconButton
          onClick={toggle}
          aria-label={
            open ? searchT('hit', 'collapse') : searchT('hit', 'expand')
          }
          className={open ? cls.expandLess : cls.expandMore}
          size="large"
        >
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </div>
    </>
  )
}
