import { makeStyles } from 'tss-react/mui'

import CloseIcon from '@mui/icons-material/Close'
import InfoIcon from '@mui/icons-material/Info'
import { Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import Slide, { SlideProps } from '@mui/material/Slide'
import Snackbar from '@mui/material/Snackbar'
import SnackbarContent from '@mui/material/SnackbarContent'

const useStyles = makeStyles()((theme) => ({
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
  const { classes: cls } = useStyles()
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
          <IconButton onClick={handleClose} size="large">
            <CloseIcon className={cls.closeIcon} />
          </IconButton>
        }
      />
    </Snackbar>
  )
}
