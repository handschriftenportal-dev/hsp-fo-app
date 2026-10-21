import { SnackbarKey, SnackbarMessage, useSnackbar } from 'notistack'
import { useCallback, useState } from 'react'
import { makeStyles } from 'tss-react/mui'

import CloseIcon from '@mui/icons-material/Close'
import ShareIcon from '@mui/icons-material/Share'
import { Button } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'

import { Tooltip } from 'src/utils/Tooltip'

import { useSearchTranslation } from '../search/utils'
import StackedToast from './StackedToast'

const useStyles = makeStyles()((theme) => ({
  shareBtn: {
    filter:
      'invert(40%) sepia(0%) saturate(133%) hue-rotate(140deg) brightness(119%) contrast(96%)',
  },
  shareDialog: {
    display: 'flex',
  },
  content: {
    display: 'flex',
    padding: theme.spacing(2),
    paddingRight: theme.spacing(0),
  },
  headline: {
    padding: theme.spacing(2),
  },
  left: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    paddingRight: theme.spacing(0),
  },
  right: {
    padding: theme.spacing(1),
  },
  inputBase: {
    borderRadius: '2px',
    border: '1px solid #ccc',
    background: theme.palette.background.default,
    flexGrow: 1,
    boxShadow: 'inset 4px 5px 4px -4px rgb(0 0 0 / 20%)',
  },
  input: {
    paddingLeft: theme.spacing(1),
  },
  copyButton: {
    marginRight: theme.spacing(2),
  },
  paper: {
    borderRadius: '1px',
  },
}))

interface Props {
  permalink: string
}

export function ShareLink(props: Readonly<Props>) {
  const { classes: cls } = useStyles()
  const { searchT } = useSearchTranslation()

  const { enqueueSnackbar } = useSnackbar()

  const { permalink } = props
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null)

  const Toast = useCallback(
    (key: SnackbarKey, message: SnackbarMessage) => (
      <StackedToast id={key} message={message} />
    ),
    [],
  )

  const handleCopyLink = () => {
    navigator.clipboard.writeText(permalink)
    enqueueSnackbar(searchT('snackMsg', 'copyLink'), {
      content: Toast,
    })
  }

  return (
    <>
      <Tooltip title={searchT('permalink', 'tooltip')}>
        <IconButton
          className="addFocusableWithOutline"
          size="small"
          tabIndex={0}
          onClick={(e) => setAnchor(e.currentTarget)}
          aria-label={searchT('permalink', 'tooltip')}
        >
          <ShareIcon className={cls.shareBtn} aria-hidden="true" />
        </IconButton>
      </Tooltip>
      <Popover
        open={!!anchor}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{ className: cls.paper }}
      >
        <div className={cls.shareDialog}>
          <div className={cls.left}>
            <Typography variant="body1" className={cls.headline}>
              {searchT('permalink', 'text')}
            </Typography>
            <div className={cls.content}>
              <Button
                onClick={handleCopyLink}
                className={cls.copyButton}
                color="primary"
                variant="contained"
                size="small"
                aria-label={searchT('permalink', 'copy')}
              >
                {searchT('permalink', 'copy')}
              </Button>
              <InputBase
                className={cls.inputBase}
                value={permalink}
                inputProps={{
                  className: cls.input,
                }}
              />
            </div>
          </div>
          <div className={cls.right}>
            <IconButton onClick={() => setAnchor(null)} size="large">
              <CloseIcon />
            </IconButton>
          </div>
        </div>
      </Popover>
    </>
  )
}
