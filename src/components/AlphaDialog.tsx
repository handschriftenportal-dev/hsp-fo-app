/*
 * MIT License
 *
 * Copyright (c) 2021 Staatsbibliothek zu Berlin - Preußischer Kulturbesitz
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
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import React, { useState } from 'react'
import ReactDom from 'react-dom'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import Button from '@material-ui/core/Button'
import { i18n } from 'i18next'
import { Fonts } from './Fonts'
import { Theme } from './Theme'
import { I18n, useI18n } from './I18n'


function AlphaDialog() {
  const i18n = useI18n()
  const t = i18n.t.bind(i18n)
  const [open, setOpen] = useState(true)

  function close() {
    setOpen(false)
  }

  return (
    <Dialog open={open} data-testid="shell-alpha-dialog">
      <DialogTitle>
        {t('alphaDialog.title')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('alphaDialog.text')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          component="a"
          href={t('links.tracking')}
          target="_blank"
          color="primary"
        >
          {t('alphaDialog.trackingButton')}
        </Button>
        <Button
          component="a"
          href={t('links.instructions')}
          target="_blank"
          color="primary"
        >
          {t('alphaDialog.userInstructions')}
        </Button>
        <Button
          onClick={close}
          color="primary"
        >
          {t('alphaDialog.buttonOk')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export function renderAlphaDialog(i18n: i18n) {
  const container = document.getElementById('alpha-dialog')

  if (!container) {
    console.error('renderAlphaDialog: could not find container element with id "alpha-dialog"')
    return
  }

  ReactDom.render(
    <Fonts>
      <Theme>
        <I18n.Provider value={i18n}>
          <AlphaDialog />
        </I18n.Provider>
      </Theme>
    </Fonts>,
    container
  )
}
