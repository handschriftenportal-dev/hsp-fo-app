import { makeStyles } from 'tss-react/mui'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import CloseIcon from '@mui/icons-material/Close'
import { Portal, Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import Snackbar from '@mui/material/Snackbar'
import SnackbarContent from '@mui/material/SnackbarContent'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

const useStyles = makeStyles()((theme) => ({
  containerRoot: {
    top: '80px',
    maxWidth: 300,
    marginLeft: 'auto',
    marginRight: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      bottom: 'unset',
      right: 'unset',
      // Calculate top: Header 80px + Nav paddingTop 8px + 3 NavItem 56px = 192px + 3 Divider 1px = 3px
      top: `calc(${theme.mixins.toolbar.minHeight}px + 8px + 56px * 3 + 1px * 3)`,
      transform: 'translateX(0)',
    },
    [theme.breakpoints.down('sm')]: {
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
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'nowrap',
    },
  },
  content: {
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      maxWidth: 200,
      flexDirection: 'row',
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: theme.spacing(-0.75),
    },
  },
  itemIcon: {
    justifyContent: 'flex-end',
    [theme.breakpoints.up('sm')]: {
      justifyContent: 'flex-start',
    },
    [theme.breakpoints.down('sm')]: {
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
  const { classes: cls } = useStyles()
  const { open, handleClose, message } = props
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('sm'))

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
            <IconButton onClick={handleClose} size="large">
              <CloseIcon />
            </IconButton>
          }
        />
      </Snackbar>
    </Portal>
  )
}
