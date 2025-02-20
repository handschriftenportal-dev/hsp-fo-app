import clsx from 'clsx'
import React, { Suspense } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import Drawer from '@material-ui/core/Drawer'
import { makeStyles } from '@material-ui/core/styles'

import { selectors } from 'src/contexts/selectors'

import { SideBar } from '../shared/SideBar'
import { Footer } from './Footer'
import { TopBar } from './TopBar'

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
  },
  sideBar: {
    flexShrink: 0,
    paddingTop: theme.spacing(10),
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
    flexGrow: 1,
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
  navFrame: {
    position: 'sticky',
    zIndex: 1200,
    height: theme.mixins.toolbar.minHeight,
    flexShrink: 0,
  },
  content: {
    display: 'flex',
    flexGrow: 1,
    flexShrink: 0,
    '&:focus-visible': {
      outlineOffset: `${theme.spacing(-0.5)}px !important`,
    },
  },
}))

interface Props {
  className?: string
  Outlet: React.ReactElement
}

export function WebNavigation(props: Readonly<Props>) {
  const cls = useStyles()
  const sideBarOpen = useSelector(selectors.getSidebarOpen)
  const location = useLocation()

  const isInWorkspace = location.pathname.includes('workspace')
  const isMiradorMaximized = useSelector(selectors.getIsMiradorMaximized)
  const isWorkspaceMaximized = isMiradorMaximized && isInWorkspace

  return (
    <>
      <div
        data-testid="navigation-web"
        className={clsx(cls.root, props.className)}
      >
        <div className={cls.navFrame}>
          <TopBar />
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
        </div>
        <div
          id="content"
          tabIndex={-1}
          className={clsx(cls.content, 'addFocusableWithOutline', {
            [cls.mainWhenSideBarOpen]: sideBarOpen && !isWorkspaceMaximized,
            [cls.mainWhenSideBarClosed]: !sideBarOpen && !isWorkspaceMaximized,
          })}
        >
          <Suspense fallback={null}>
            <main className={cls.main}>{props.Outlet}</main>
          </Suspense>
        </div>
      </div>
      {!isInWorkspace && (
        <div
          className={clsx('addFocusableWithOutline', {
            [cls.mainWhenSideBarOpen]: sideBarOpen,
            [cls.mainWhenSideBarClosed]: !sideBarOpen,
          })}
        >
          <Footer />
        </div>
      )}
    </>
  )
}
