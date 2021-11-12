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
import { makeStyles } from '@material-ui/core/styles'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import { i18n } from 'i18next'
import { Theme } from './Theme'
import { Fonts } from './Fonts'
import { I18n, useI18n } from './I18n'


const useStyles = makeStyles(theme => ({
  root: {
    position: 'fixed',
    bottom: theme.spacing(0),
    right: theme.spacing(0),
    zIndex: 10,
    margin: theme.spacing(2)
  }
}))

export function FeedbackButton() {
  const cls = useStyles()
  const [show, setShow] = useState(true)
  const i18n = useI18n()

  function close() {
    setShow(false)
  }

  if (!show) {
    return null
  }

  return (
    <ButtonGroup
      className={cls.root}
      color="primary"
      variant="contained"
      size="small"
    >
      <Button
        component="a"
        href={i18n.t('links.feedback')}
        target="_blank"
        startIcon={
          <span className="material-icons">
            email
          </span>
        }
      >
        Feedback
      </Button>
      <Button onClick={close}>
        <span className="material-icons">
          close
        </span>
      </Button>
    </ButtonGroup>
  )
}

export function renderFeedbackButton(i18n: i18n) {
  const container = document.getElementById('feedback-button')

  if (!container) {
    console.error('renderFeedbackButton: could not find container element with id "feedback-button"')
    return
  }

  ReactDom.render(
    <Fonts>
      <Theme>
        <I18n.Provider value={i18n}>
          <FeedbackButton />
        </I18n.Provider>
      </Theme>
    </Fonts>,
    container
  )
}
