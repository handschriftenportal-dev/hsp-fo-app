/*
 * MIT License
 *
 * Copyright (c) 2023 Staatsbibliothek zu Berlin - Preußischer Kulturbesitz
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import React, { ReactNode } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Badge from '@material-ui/core/Badge'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import IconButton from '@material-ui/core/IconButton'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import HomeIcon from '@material-ui/icons/Home'
import SearchIcon from '@material-ui/icons/Search'
import GroupIcon from '@material-ui/icons/Group'
import DashboardIcon from '@material-ui/icons/Dashboard'
import CollectionsIcon from '@material-ui/icons/Collections'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import FullscreenIcon from '@material-ui/icons/Fullscreen'
import LanguageIcon from '@material-ui/icons/Language'
import InfoIcon from '@material-ui/icons/Info'
import { Link } from 'react-router-dom'
import ListItem from '@material-ui/core/ListItem'
import { Tooltip } from 'src/utils/Tooltip'
import { relative } from 'src/utils/relative'

const useItemStylesLevel0 = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    ...theme.typography.subtitle1,
  },
  linkOrButton: {},
  icon: {},
  badge: {
    color: 'white',
  },
  selected: {
    backgroundColor: theme.palette.action.selected,
  },
}))

const useItemStylesLevel1 = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    ...theme.typography.subtitle2,
  },
  linkOrButton: {},
  icon: {
    color: '#888',
  },
  badge: {
    color: 'white',
  },
  selected: {
    backgroundColor: theme.palette.action.selected,
  },
}))

const useItemStylesLevel2 = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    ...theme.typography.subtitle2,
  },
  linkOrButton: {
    paddingLeft: theme.spacing(9),
  },
  icon: {
    color: '#888',
  },
  badge: {
    color: 'white',
  },
  selected: {
    backgroundColor: theme.palette.action.selected,
  },
}))

export function useItemStyles(level: number) {
  if (level === 0) return useItemStylesLevel0()
  else if (level === 1) return useItemStylesLevel1()
  else return useItemStylesLevel2()
}

function LinkOrButton(props: {
  className?: string
  href?: string
  onClick?: () => void
  children?: ReactNode
  id?: string
}) {
  return props.href ? (
    <ListItem
      className={props.className}
      component={Link}
      to={relative(props.href)}
      onClick={props.onClick}
      button={true}
      role="link"
      children={props.children}
      id={props.id}
    />
  ) : (
    <ListItem
      className={props.className}
      button={true}
      onClick={props.onClick}
      children={props.children}
      id={props.id}
    />
  )
}

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

export function MenuItem(props: Props) {
  const cls = useItemStyles(props.level)

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
        className={cls.linkOrButton}
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
              <Badge
                badgeContent={props.badgeCount || 0}
                color="secondary"
                aria-hidden={true}
                anchorOrigin={{
                  horizontal: 'right',
                  vertical: 'bottom',
                }}
                classes={{
                  badge: cls.badge,
                }}
                // see https://github.com/mui/material-ui/issues/32137#issuecomment-1143251469
                overlap="rectangular"
              >
                {props.icon === 'home' && <HomeIcon aria-hidden={true} />}
                {props.icon === 'search' && <SearchIcon aria-hidden={true} />}
                {props.icon === 'groups' && <GroupIcon aria-hidden={true} />}
                {props.icon === 'dashboard' && (
                  <DashboardIcon aria-hidden={true} />
                )}
                {props.icon === 'collections' && (
                  <CollectionsIcon aria-hidden={true} />
                )}
                {props.icon === 'more_vert' && (
                  <MoreVertIcon aria-hidden={true} />
                )}
                {props.icon === 'fullscreen' && (
                  <FullscreenIcon aria-hidden={true} />
                )}
                {props.icon === 'language' && (
                  <LanguageIcon aria-hidden={true} />
                )}
                {props.icon === 'info' && <InfoIcon aria-hidden={true} />}
              </Badge>
            </ListItemIcon>
          </Tooltip>
        )}
        <ListItemText disableTypography={true}>{props.label}</ListItemText>
      </LinkOrButton>
      {props.onExpand && (
        <IconButton onClick={props.onExpand}>
          <ExpandMoreIcon />
        </IconButton>
      )}
      {props.onCollapse && (
        <IconButton onClick={props.onCollapse}>
          <ExpandLessIcon />
        </IconButton>
      )}
    </div>
  )
}
