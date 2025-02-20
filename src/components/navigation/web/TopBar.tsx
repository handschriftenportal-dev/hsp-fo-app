import React from 'react'
import { useSelector } from 'react-redux'

import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'

import { useFeatureFlags } from 'src/contexts/features'
import { selectors } from 'src/contexts/selectors'

import { Login } from '../shared/Login'
import { Logo } from '../shared/Logo'
import { SearchBarContainer } from '../shared/SearchBarContainer'
import { SideBarButton } from '../shared/SideBarButton'

const useStyles = makeStyles((theme) => ({
  loginButton: {
    margin: theme.spacing(1),
  },
  headerNav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  root: {
    position: 'fixed',
    display: 'flex',
    flexDirection: 'row',
    height: theme.mixins.toolbar.minHeight,
    width: '100%',
    zIndex: theme.zIndex.drawer + 1,
    paddingRight: theme.spacing(1),
  },
  left: {
    paddingLeft: theme.spacing(3),
  },
}))

export function TopBar() {
  const cls = useStyles()
  const featureFlags = useFeatureFlags()
  const isInWorkspace = location.pathname.includes('workspace')
  const isMiradorMaximized = useSelector(selectors.getIsMiradorMaximized)
  const isWorkspaceMaximized = isMiradorMaximized && isInWorkspace

  return (
    <Paper component="header" className={cls.root} elevation={24} square>
      {!isWorkspaceMaximized && <SideBarButton />}
      <div className={cls.headerNav}>
        <div className={cls.left}>
          <Logo />
        </div>
        <SearchBarContainer />
        {featureFlags.annotation && <Login />}
      </div>
    </Paper>
  )
}
