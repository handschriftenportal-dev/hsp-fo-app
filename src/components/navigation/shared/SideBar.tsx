import clsx from 'clsx'
import React from 'react'
import { useDispatch } from 'react-redux'

import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import { makeStyles } from '@material-ui/core/styles'

import { actions } from 'src/contexts/actions/actions'
import { useFeatureFlags } from 'src/contexts/features'
import { useTranslation } from 'src/contexts/i18n'

import { GlobalTools } from '../shared/GlobalTools'
import { Menu } from '../shared/Menu'
import { SideBarButton } from '../shared/SideBarButton'
import { Login } from './Login'
import { Logo } from './Logo'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    height: 'inherit',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1.5),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  misc: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}))

interface Props {
  className?: string
  mobile: boolean
}

export function SideBar(props: Readonly<Props>) {
  const dispatch = useDispatch()
  const cls = useStyles()
  const { t } = useTranslation()
  const featureFlags = useFeatureFlags()

  return (
    <nav
      className={clsx(cls.root, props.className)}
      aria-label={t('sidebar.sidebar')}
    >
      <div>
        {props.mobile && (
          <div className={cls.header}>
            <SideBarButton />
            <Box onClick={() => dispatch(actions.toggleSidebar())}>
              <Logo />
            </Box>
            {featureFlags.annotation && <Login />}
          </div>
        )}
        <Menu mobile={props.mobile} />
      </div>
      <div>
        <GlobalTools mobile={props.mobile} />
        <Divider />
      </div>
    </nav>
  )
}
