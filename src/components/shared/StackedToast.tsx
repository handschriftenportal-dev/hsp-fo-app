import { SnackbarKey, SnackbarMessage, useSnackbar } from 'notistack'
import { ReactNode, forwardRef, useCallback } from 'react'
import { makeStyles } from 'tss-react/mui'

import CloseIcon from '@mui/icons-material/Close'
import InfoIcon from '@mui/icons-material/Info'
import { Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import SnackbarContent from '@mui/material/SnackbarContent'

const useStyles = makeStyles()((theme) => ({
  snackbar: {
    backgroundColor: 'white',
    color: 'black',
    pointerEvents: 'all',
  },
  content: {
    alignItems: 'center',
    display: 'flex',
  },
  closeIcon: {
    cursor: 'pointer',
    paddingY: '8px',
  },
  infoIcon: {
    color: theme.palette.secondary.main,
    fontSize: theme.spacing(4),
  },
}))

interface Props {
  id: SnackbarKey
  message: SnackbarMessage | ReactNode
}

const StackedToast = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { id, message } = props
  const { classes: cls } = useStyles()
  const { closeSnackbar } = useSnackbar()

  const handleDismiss = useCallback(() => {
    closeSnackbar(id)
  }, [id, closeSnackbar])

  return (
    <SnackbarContent
      ref={ref}
      className={cls.snackbar}
      message={
        <span className={cls.content}>
          <ListItemIcon>
            <InfoIcon className={cls.infoIcon} />
          </ListItemIcon>
          {typeof message === 'string' ? (
            <Typography variant="body1">{message}</Typography>
          ) : (
            message
          )}
        </span>
      }
      action={
        <IconButton onClick={handleDismiss} size="large">
          <CloseIcon className={cls.closeIcon} />
        </IconButton>
      }
    />
  )
})

StackedToast.displayName = 'StackedToast'
export default StackedToast
