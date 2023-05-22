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
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import MenuIcon from '@material-ui/icons/Menu'
import { Tooltip } from 'src/utils/Tooltip'
import { useTranslation } from 'src/contexts/i18n'
import { useDispatch, useSelector } from 'react-redux'
import { actions, selectors } from 'src/contexts/state'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  icon: {
    [theme.breakpoints.up('sm')]: {
      top: '15px',
      left: '8px',
      zIndex: 1202,
      position: 'fixed',
    },
    [theme.breakpoints.only('xs')]: {
      marginRight: theme.spacing(-2),
    },
  },
}))

interface Props {
  className?: string
}

export function SideBarButton(props: Props) {
  const dispatch = useDispatch()
  const sideBarOpen = useSelector(selectors.getSidebarOpen)
  const { t } = useTranslation()
  const { className } = props
  const cls = useStyles()

  return (
    <Tooltip
      title={
        sideBarOpen ? t('topBar.collapseSidebar') : t('topBar.expandSidebar')
      }
    >
      <IconButton
        id="sideBarMenu"
        aria-label={
          sideBarOpen ? t('topBar.collapseSidebar') : t('topBar.expandSidebar')
        }
        className={clsx(className, cls.icon)}
        onClick={() => dispatch(actions.toggleSidebar())}
      >
        {sideBarOpen ? <CloseIcon /> : <MenuIcon />}
      </IconButton>
    </Tooltip>
  )
}
