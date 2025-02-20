import clsx from 'clsx'
import React, { forwardRef } from 'react'
import { useSelector } from 'react-redux'

import Drawer from '@material-ui/core/Drawer'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'

import { useFeatureFlags } from 'src/contexts/features'
import { selectors } from 'src/contexts/selectors'

import { Login } from '../shared/Login'
import { Logo } from '../shared/Logo'
import { SearchBarContainer } from '../shared/SearchBarContainer'
import { SideBar } from '../shared/SideBar'
import { SideBarButton } from '../shared/SideBarButton'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1.5),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    minHeight: theme.mixins.toolbar.minHeight,
    zIndex: 1200,
  },
  headerNav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sidebar: {
    width: '100%',
  },
  left: {
    paddingLeft: theme.spacing(3),
  },
}))

interface Props {
  className?: string
}

export const TopBar = forwardRef(function TopBar(props: Props, ref) {
  const cls = useStyles()
  const featureFlags = useFeatureFlags()
  const sideBarOpen = useSelector(selectors.getSidebarOpen)

  return (
    <Paper
      component="header"
      className={clsx(cls.root, props.className)}
      elevation={24}
      ref={ref}
      square
    >
      <div className={cls.headerNav}>
        <SideBarButton />
        <Drawer
          open={sideBarOpen}
          classes={{
            paper: cls.sidebar,
          }}
        >
          <SideBar mobile={true} />
        </Drawer>
        <div className={cls.left}>
          <Logo />
        </div>
        {featureFlags.annotation && <Login />}
      </div>
      <SearchBarContainer />
    </Paper>
  )
})
