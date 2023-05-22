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

import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MailOutlinedIcon from '@material-ui/icons/MailOutlined'
import Typography from '@material-ui/core/Typography'

import { Link } from 'react-router-dom'
import { relative } from 'src/utils/relative'
import { useSelector } from 'react-redux'
import { LocaleSwitch } from './LocaleSwitch'
import { useTranslation } from 'src/contexts/i18n'
import { actions, useDispatch, selectors } from 'src/contexts/state'

const useStyles = makeStyles((theme) => ({
  feedbackIcon: {
    color: theme.palette.primary.main,
    '&:focus': {
      background: theme.palette.action.selected,
    },
  },
}))

interface Props {
  className?: string
  mobile: boolean
}

export function GlobalTools(props: Props) {
  const dispatch = useDispatch()
  const cls = useStyles()
  const { t } = useTranslation()
  const sideBarOpen = useSelector(selectors.getSidebarOpen)

  return (
    <List
      className={props.className}
      component="div"
      role="toolbar"
      aria-orientation="vertical"
    >
      <LocaleSwitch sideBarOpen={sideBarOpen} mobile={props.mobile} />
      <ListItem
        className={cls.feedbackIcon}
        button={true}
        component={Link}
        to={relative(t('links.feedback'))}
        onClick={() => props.mobile && dispatch(actions.toggleSidebar())}
        role="link"
      >
        <ListItemIcon>
          <MailOutlinedIcon className={cls.feedbackIcon} aria-hidden={true} />
        </ListItemIcon>
        <ListItemText>
          <Typography variant="subtitle1">
            {t('sidebar.tools.feedback')}
          </Typography>
        </ListItemText>
      </ListItem>
    </List>
  )
}
