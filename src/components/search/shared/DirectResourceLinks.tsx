import clsx from 'clsx'
import React from 'react'
import { Link } from 'react-router-dom'

import Icon from '@material-ui/core/Icon'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import { Tooltip } from 'src/utils/Tooltip'

import { ShareLink } from '../../shared/ShareLink'
import { useSearchTranslation } from '../utils'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    border: 'none',
    paddingTop: 0,
    paddingBottom: 0,
  },
  anchor: {
    paddingTop: theme.spacing(1),
  },
  button: {
    paddingRight: theme.spacing(1),
    cursor: 'pointer',
    paddingBottom: theme.spacing(1),
    minWidth: 'auto',
    '&:hover': {
      background: 'inherit',
    },
  },
  color: {
    color: theme.palette.liver.light,
  },
  link: {
    textDecoration: 'none',
    paddingLeft: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
  },
  vertical: {
    flexDirection: 'column',
  },
  iconBtn: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    padding: theme.spacing(0.25),
  },
}))

interface Props {
  className?: string
  detailPage?: boolean
  linkToDetailView: string
  numOfDescriptions: number
  numOfDigitizeds: number
  onClick: (resourceType: 'hsp-descriptions' | 'hsp-digitizeds') => void
  permalink?: string | null
  vertical: boolean
}

export function DirectResourceLinks(props: Readonly<Props>) {
  const {
    className,
    vertical,
    numOfDescriptions,
    numOfDigitizeds,
    linkToDetailView,
    onClick,
    detailPage,
    permalink,
  } = props
  const cls = useStyles()
  const { searchT } = useSearchTranslation()

  return (
    <fieldset
      className={clsx(cls.root, { [cls.vertical]: vertical }, className)}
      aria-label={searchT('hits', 'resources')}
    >
      {detailPage && permalink && <ShareLink permalink={permalink} />}
      {[
        {
          label: searchT('overview', 'showManuscriptDescriptions'),
          hash: 'hsp-descriptions',
          icon: 'text_snippet',
          count: numOfDescriptions,
          src: '/img/beschreibung.svg',
        },
        {
          label: searchT('overview', 'showDigitalImages'),
          hash: 'hsp-digitizeds',
          icon: 'insert_photo',
          count: numOfDigitizeds,
          src: '/img/digitalisat.svg',
        },
      ].map((resource) => (
        <Link
          key={resource.label}
          className={clsx('addFocusableWithOutline', cls.link, {
            [cls.anchor]: !vertical,
          })}
          to={linkToDetailView + '#' + resource.hash}
          aria-label={resource.label}
        >
          <Tooltip title={resource.label} key={resource.label}>
            <ListItemIcon
              tabIndex={-1}
              className={clsx(cls.button, cls.color)}
              onClick={() =>
                onClick(resource.hash as 'hsp-descriptions' | 'hsp-digitizeds')
              }
            >
              <Icon>
                <img
                  className={cls.iconBtn}
                  src={resource.src}
                  aria-hidden={true}
                  alt={resource.label}
                />
              </Icon>
            </ListItemIcon>
            <Typography className={cls.color} component="span" variant="body2">
              {resource.count}
            </Typography>
          </Tooltip>
        </Link>
      ))}
    </fieldset>
  )
}

DirectResourceLinks.defaultProps = {
  onClick: () => {},
}
