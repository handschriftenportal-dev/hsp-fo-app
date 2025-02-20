import clsx from 'clsx'
import React from 'react'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { Typography } from '@material-ui/core'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import CloseIcon from '@material-ui/icons/Close'
import Alert from '@material-ui/lab/Alert'

import { Grid } from 'src/components/shared/Grid'
import { actions } from 'src/contexts/actions/actions'
import { catalogActions } from 'src/contexts/actions/catalogActions'
import { catalogSelectors, selectors } from 'src/contexts/selectors'

const useStyles = makeStyles((theme) => ({
  alert: {
    backgroundColor: theme.palette.whiteSmoke.main,
    color: theme.palette.black.main,
  },
  grid: {
    paddingTop: theme.spacing(4),
  },
  link: {
    alignItems: 'center',
    color: theme.palette.primary.main,
    display: 'inline-flex',
  },
}))

export default function CatalogNotification() {
  const cls = useStyles()

  const dispatch = useDispatch()

  const sideBarOpen = useSelector(selectors.getSidebarOpen)
  const notificationOpen = useSelector(
    catalogSelectors.getCatalogNotificationOpen,
  )

  const handleClick = () => {
    if (!sideBarOpen) {
      dispatch(actions.toggleSidebar())
    }
  }

  return (
    <Grid className={cls.grid}>
      <Collapse in={notificationOpen}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                dispatch(catalogActions.toggleNotification())
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          className={cls.alert}
          icon={false}
        >
          <Typography variant="body1">
            <Trans
              i18nKey={'catalog.notificationText'}
              components={{
                Link: (
                  <Link
                    to={'/info/content'}
                    className={clsx(cls.link, 'addFocusableWithOutline')}
                    onClick={handleClick}
                  />
                ),
                Icon: <ArrowForwardIcon fontSize="small" />,
              }}
            />
          </Typography>
        </Alert>
      </Collapse>
    </Grid>
  )
}
