/*
 * MIT License
 *
 * Copyright (c) 2023 Staatsbibliothek zu Berlin - Preußischer Kulturbesitz
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import Slide, { SlideProps } from '@material-ui/core/Slide'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import { makeStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import InfoIcon from '@material-ui/icons/Info'
import IconButton from '@material-ui/core/IconButton'
import { Typography } from '@material-ui/core'

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
    paddingY: '8px',
    cursor: 'pointer',
  },
  infoIcon: {
    color: theme.palette.secondary.main,
    fontSize: theme.spacing(4),
  },
}))

function slideTransistion(props: SlideProps) {
  return <Slide {...props} direction="left" />
}

interface Props {
  open: boolean
  message: string
  handleClose: () => void
}

export function Toast(props: Props) {
  const cls = useStyles()
  const { open, handleClose, message } = props

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      TransitionComponent={slideTransistion}
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
