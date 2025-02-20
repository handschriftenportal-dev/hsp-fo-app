import React from 'react'

import { Portal, Typography } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import CloseIcon from '@material-ui/icons/Close'

const useStyles = makeStyles((theme) => ({
  containerRoot: {
    top: '80px',
    maxWidth: 300,
    marginLeft: 'auto',
    marginRight: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      bottom: 'unset',
      right: 'unset',
      // Calculate top: Header 80px + Nav paddingTop 8px + 4 NavItem 64px = 192px + 3 Divider 1px = 3px
      top: 'calc(80px + 8px + 64px * 4 + 1px * 3)',
      transform: 'translateX(0)',
    },
    [theme.breakpoints.down('xs')]: {
      marginLeft: 'unset',
      top: 60,
    },
  },
  snackbar: {
    backgroundColor: theme.palette.electricBlue.main,
    color: 'black',
    pointerEvents: 'all',
    display: 'flex',
    alignItems: 'flex-start',
    [theme.breakpoints.down('xs')]: {
      flexWrap: 'nowrap',
    },
  },
  content: {
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      maxWidth: 200,
      flexDirection: 'row',
    },
    [theme.breakpoints.down('xs')]: {
      marginLeft: theme.spacing(-0.75),
    },
  },
  itemIcon: {
    justifyContent: 'flex-end',
    [theme.breakpoints.up('sm')]: {
      justifyContent: 'flex-start',
    },
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'unset',
    },
  },
  arrowIcon: {
    fontSize: theme.spacing(4),
  },
}))

interface Props {
  open: boolean
  message: string
  handleClose: () => void
}

export function WorkspaceToast(props: Readonly<Props>) {
  const cls = useStyles()
  const { open, handleClose, message } = props
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('xs'))

  return (
    <Portal container={document.getElementById('content')}>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={open}
        key={message}
        className={cls.containerRoot}
        autoHideDuration={2000}
        onClose={handleClose}
      >
        <SnackbarContent
          className={cls.snackbar}
          message={
            <div className={cls.content}>
              <ListItemIcon className={cls.itemIcon}>
                {mobile ? (
                  <ArrowUpwardIcon className={cls.arrowIcon} />
                ) : (
                  <ArrowBackIcon className={cls.arrowIcon} />
                )}
              </ListItemIcon>
              <Typography>{message}</Typography>
            </div>
          }
          action={
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          }
        />
      </Snackbar>
    </Portal>
  )
}
