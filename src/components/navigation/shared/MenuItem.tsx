import clsx from 'clsx'
import React, { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'
import { makeStyles } from 'tss-react/mui'

import BookSharpIcon from '@mui/icons-material/BookSharp'
import BurstModeIcon from '@mui/icons-material/BurstMode'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import GroupIcon from '@mui/icons-material/Group'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import SettingsIcon from '@mui/icons-material/Settings'
import { Box, Typography } from '@mui/material'
import Badge from '@mui/material/Badge'
import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import { useTranslation } from 'src/contexts/i18n'
import { selectors } from 'src/contexts/selectors'
import { Tooltip } from 'src/utils/Tooltip'

interface Props {
  href?: string
  onClick?: () => void
  label: string
  icon?: string
  badgeCount?: number
  showTooltip?: boolean
  selected?: boolean
  level: number
  onExpand?: () => void
  onCollapse?: () => void
  id?: string
}

const useStyles = makeStyles<Props>()((theme, { level }) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    height: 56,
    ...((level === 0
      ? theme.typography.subtitle1
      : theme.typography.subtitle2) as React.CSSProperties),
    lineHeight: '2.5',
  },
  linkOrButton: {
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
    minHeight: 56,
    '&:focus-visible': {
      outlineOffset: theme.spacing(-0.5),
    },
  },
  paddingWithoutIcon: {
    paddingLeft: level === 0 ? theme.spacing(0.5) : theme.spacing(1),
  },
  icon: {
    justifyContent: 'center',
    color: level === 0 ? undefined : '#888',
    // if icon is a outermedia svg color is not working
    filter:
      level === 0
        ? undefined
        : 'invert(64%) sepia(0%) saturate(363%) hue-rotate(176deg) brightness(85%) contrast(80%)',
  },
  badge: {
    color: 'white',
    top: theme.spacing(0.5),
    right: theme.spacing(-0.5),
  },
  selected: {
    backgroundColor: theme.palette.action.selected,
  },
  iconBtn: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    padding: theme.spacing(0.25),
  },
  languageIcon: {
    padding: '0px !important',
  },
  withLabelBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  listItemText: { paddingLeft: '8px' },
  disable: {
    display: 'none',
  },
}))

function LinkOrButton(props: {
  className?: string
  href?: string
  onClick?: () => void
  children?: ReactNode
  id?: string
}) {
  return props.href ? (
    <ListItemButton
      className={props.className}
      component={Link}
      to={props.href}
      onClick={props.onClick}
      role="link"
      id={props.id}
    >
      {props.children}
    </ListItemButton>
  ) : (
    <ListItemButton
      className={props.className}
      onClick={props.onClick}
      id={props.id}
    >
      {props.children}
    </ListItemButton>
  )
}

type CaptionWrapperProps = {
  children: ReactNode
  cls: Record<string, string>
  label: string
  badgeCount?: number
}

const CaptionWrapper = (props: CaptionWrapperProps) => {
  const sideBarOpen = useSelector(selectors.getSidebarOpen)
  const { label, cls, children } = props

  return (
    <Box className={cls.withLabelBox}>
      <Badge
        badgeContent={props.badgeCount}
        color="secondary"
        aria-hidden={true}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
        classes={{
          badge: cls.badge,
        }}
        // see https://github.com/mui/material-ui/issues/32137#issuecomment-1143251469
        overlap="rectangular"
      >
        {children}
      </Badge>
      <Typography variant="caption" sx={{ fontSize: '10px' }}>
        {!sideBarOpen && label}
      </Typography>
    </Box>
  )
}

type CustomIconType = {
  className: string
  icon: string
}

const CustomIcon = (props: CustomIconType) => {
  const { className, icon } = props

  return (
    <Icon>
      <img
        className={className}
        src={`/icons/${icon}.svg`}
        aria-hidden={true}
        alt={icon}
      />
    </Icon>
  )
}

export function MenuItem(props: Readonly<Props>) {
  const { classes: cls } = useStyles(props)
  const { t } = useTranslation()
  const sideBarOpen = useSelector(selectors.getSidebarOpen)

  if (!props.href && !props.onClick) {
    throw new Error('MenuItem: property `href` or `onClick` must be given.')
  }

  return (
    <div
      className={clsx(cls.root, {
        [cls.selected]: props.selected,
      })}
    >
      <LinkOrButton
        className={clsx(cls.linkOrButton, cls.paddingWithoutIcon)}
        href={props.href}
        onClick={props.onClick}
        id={props.id}
      >
        {props.icon && (
          <Tooltip
            disable={!props.showTooltip}
            title={props.label}
            aria-hidden={true}
          >
            <ListItemIcon className={cls.icon}>
              {props.icon === 'home' && (
                <CaptionWrapper label={props.label} cls={cls}>
                  <CustomIcon className={cls.iconBtn} icon="home" />
                </CaptionWrapper>
              )}
              {props.icon === 'search' && (
                <CaptionWrapper label={props.label} cls={cls}>
                  <CustomIcon className={cls.iconBtn} icon="search" />
                </CaptionWrapper>
              )}
              {props.icon === 'projects' && (
                <CaptionWrapper label={props.label} cls={cls}>
                  <GroupIcon aria-hidden={true} />
                </CaptionWrapper>
              )}
              {props.icon === 'dashboard' && (
                <CaptionWrapper
                  label={props.label}
                  cls={cls}
                  badgeCount={props.badgeCount}
                >
                  <CustomIcon className={cls.iconBtn} icon="workspace" />
                </CaptionWrapper>
              )}
              {props.icon === 'burstMode' && (
                <CaptionWrapper
                  label={t('sidebar.workspaceCaption.windows')}
                  cls={cls}
                >
                  <BurstModeIcon aria-hidden={true} />
                </CaptionWrapper>
              )}
              {props.icon === 'library' && (
                <CaptionWrapper
                  label={t('sidebar.workspaceCaption.add')}
                  cls={cls}
                >
                  <LibraryAddIcon aria-hidden={true} />
                </CaptionWrapper>
              )}
              {props.icon === 'settings' && (
                <CaptionWrapper
                  label={t('sidebar.workspaceCaption.view')}
                  cls={cls}
                >
                  <SettingsIcon aria-hidden={true} />
                </CaptionWrapper>
              )}
              {props.icon === 'fullscreen' && (
                <CaptionWrapper
                  label={t('sidebar.workspaceCaption.fullscreen')}
                  cls={cls}
                >
                  <CustomIcon
                    className={cls.iconBtn}
                    icon="workspace_vollbild"
                  />
                </CaptionWrapper>
              )}
              {props.icon === 'language' && (
                <CaptionWrapper label={props.label} cls={cls}>
                  <CustomIcon className={cls.iconBtn} icon="language" />
                </CaptionWrapper>
              )}
              {props.icon === 'info' && (
                <CaptionWrapper label={'Info'} cls={cls}>
                  <CustomIcon className={cls.iconBtn} icon="nutzungshinweise" />
                </CaptionWrapper>
              )}
              {props.icon === 'lab' && (
                <CaptionWrapper label={'Lab'} cls={cls}>
                  <CustomIcon className={cls.iconBtn} icon="lab" />
                </CaptionWrapper>
              )}
              {props.icon === 'catalogs' && (
                <CaptionWrapper label={props.label} cls={cls}>
                  <BookSharpIcon aria-hidden={true} />
                </CaptionWrapper>
              )}
            </ListItemIcon>
          </Tooltip>
        )}
        <ListItemText
          className={sideBarOpen ? cls.listItemText : cls.disable}
          disableTypography={true}
        >
          {props.label}
        </ListItemText>
      </LinkOrButton>
      {props.onExpand && (
        <IconButton onClick={props.onExpand} size="large">
          <ExpandMoreIcon />
        </IconButton>
      )}
      {props.onCollapse && (
        <IconButton onClick={props.onCollapse} size="large">
          <ExpandLessIcon />
        </IconButton>
      )}
    </div>
  )
}
