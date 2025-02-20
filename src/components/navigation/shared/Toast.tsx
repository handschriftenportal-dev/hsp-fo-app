import React from 'react'

import { Typography } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Slide, { SlideProps } from '@material-ui/core/Slide'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import { makeStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import InfoIcon from '@material-ui/icons/Info'

const useStyles = makeStyles((theme) => ({
  snackbar: {
    backgroundColor: 'white',
    color: 'black',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
  },
  closeIcon: {
    paddingY: theme.spacing(1),
    cursor: 'pointer',
  },
  infoIcon: {
    color: theme.palette.secondary.main,
    fontSize: theme.spacing(4),
  },
}))

function slideTransition(props: SlideProps) {
  return <Slide {...props} direction="left" />
}

interface Props {
  open: boolean
  message: string
  handleClose: () => void
}

export function Toast(props: Readonly<Props>) {
  const cls = useStyles()
  const { open, handleClose, message } = props

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      TransitionComponent={slideTransition}
    >
      <SnackbarContent
        className={cls.snackbar}
        message={
          <span className={cls.content}>
            <ListItemIcon>
              <InfoIcon className={cls.infoIcon} />
            </ListItemIcon>
            <Typography>{message}</Typography>
          </span>
        }
        action={
          <IconButton onClick={handleClose}>
            <CloseIcon className={cls.closeIcon} />
          </IconButton>
        }
      />
    </Snackbar>
  )
}
