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

import React, { useRef, useEffect, forwardRef } from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Drawer from '@material-ui/core/Drawer'
import { useSelector, selectors } from 'src/contexts/state'
import { SideBar } from '../shared/SideBar'
import { SideBarButton } from '../shared/SideBarButton'
import { useTranslation } from 'src/contexts/i18n'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1.5),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    zIndex: 1200,
  },
  upper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lower: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(2),
  },
  sidebar: {
    width: '100%',
  },
}))

interface Props {
  className?: string
  topBarTools?: Element
}

export const TopBar = forwardRef(function TopBar(props: Props, ref) {
  const cls = useStyles()
  const { t } = useTranslation()
  const topBarToolsRef = useRef<HTMLDivElement>(null)
  const sideBarOpen = useSelector(selectors.getSidebarOpen)

  useEffect(() => {
    if (topBarToolsRef.current && props.topBarTools) {
      topBarToolsRef.current.appendChild(props.topBarTools)
    }
  }, [])

  return (
    <Paper
      component="header"
      className={clsx(cls.root, props.className)}
      elevation={24}
      ref={ref}
      square
    >
      <div className={cls.upper}>
        <Link to="/" aria-label={t('topBar.logoLink')}>
          <img
            src="/img/handschriftenportal_logo.svg"
            width="200"
            alt={t('logo')}
          />
        </Link>
        <SideBarButton />
        <Drawer
          open={sideBarOpen}
          classes={{
            paper: cls.sidebar,
          }}
        >
          <SideBar mobile={true} />
        </Drawer>
      </div>
      {props.topBarTools && <div ref={topBarToolsRef} className={cls.lower} />}
    </Paper>
  )
})
