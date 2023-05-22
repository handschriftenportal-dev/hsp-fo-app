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

import React, { useRef, useEffect } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Grid from '@material-ui/core/Grid'
import { useSelector } from 'react-redux'
import { selectors } from 'src/contexts/state'
import { SideBar } from '../shared/SideBar'
import { TopBar } from './TopBar'
import { SideBarButton } from '../shared/SideBarButton'

const useStyles = makeStyles((theme) => ({
  root: {
    flexWrap: 'nowrap',
    height: '100%',
    position: 'absolute',
  },
  sideBar: {
    flexShrink: 0,
    paddingTop: theme.spacing(12),
    whiteSpace: 'nowrap',
  },
  sideBarClosed: {
    width: theme.spacing(8),
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.leavingScreen,
      easing: theme.transitions.easing.sharp,
    }),
  },
  sideBarOpen: {
    width: theme.spacing(30),
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.enteringScreen,
      easing: theme.transitions.easing.sharp,
    }),
  },
  main: {
    position: 'relative',
    flexGrow: 1,
    display: 'flex',
    marginTop: theme.mixins.toolbar.minHeight,
  },
  mainWhenSideBarClosed: {
    marginLeft: theme.spacing(8),
    transition: theme.transitions.create('margin', {
      duration: theme.transitions.duration.leavingScreen,
      easing: theme.transitions.easing.sharp,
    }),
  },
  mainWhenSideBarOpen: {
    marginLeft: theme.spacing(30),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  sideBarDiv: {
    height: 'inherit',
    overflowX: 'hidden',
    overflowY: 'auto',
  },
}))

interface Props {
  className?: string
  main?: Element
  topBarTools?: Element
}

export function WebNavigation(props: Props) {
  const cls = useStyles()
  const sideBarOpen = useSelector(selectors.getSidebarOpen)
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (mainRef.current && props.main) {
      mainRef.current.appendChild(props.main)
    }
  }, [])

  return (
    <Grid
      data-testid="navigation-web"
      className={clsx(cls.root, props.className)}
      container
    >
      <SideBarButton />
      <Drawer
        open={sideBarOpen}
        variant="permanent"
        classes={{
          paper: clsx(cls.sideBar, {
            [cls.sideBarOpen]: sideBarOpen,
            [cls.sideBarClosed]: !sideBarOpen,
          }),
        }}
      >
        <div className={cls.sideBarDiv}>
          <SideBar mobile={false} />
        </div>
      </Drawer>
      <TopBar sideBarOpen={sideBarOpen} topBarTools={props.topBarTools} />
      <main
        ref={mainRef}
        className={clsx(cls.main, {
          [cls.mainWhenSideBarOpen]: sideBarOpen,
          [cls.mainWhenSideBarClosed]: !sideBarOpen,
        })}
      />
    </Grid>
  )
}
