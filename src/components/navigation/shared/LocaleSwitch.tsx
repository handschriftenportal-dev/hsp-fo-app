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

import { WebModuleLanguage } from 'hsp-web-module'
import React, { useEffect, useState } from 'react'
import { MenuItem } from './MenuItem'
import { useTranslation } from 'src/contexts/i18n'
import { useTracker } from 'src/contexts/tracking'
import { actions, useDispatch } from 'src/contexts/state'
import { Toast } from './Toast'

const languages: Record<WebModuleLanguage, string> = {
  de: 'Deutsch',
  en: 'English',
}

interface Props {
  sideBarOpen: boolean
  mobile: boolean
}

export function LocaleSwitch(props: Props) {
  const { sideBarOpen, mobile } = props
  const [showLocales, setShowLocales] = useState(false)
  const { t, i18n } = useTranslation()
  const tracker = useTracker()
  const dispatch = useDispatch()
  const [openToast, setOpenToast] = useState(false)

  const handleToastClose = () => {
    setOpenToast(false)
  }

  const handleMenuClick = () => {
    setShowLocales(!showLocales)
    if (!sideBarOpen) {
      dispatch(actions.toggleSidebar())
    }
  }

  function handleLocaleSelected(lang: WebModuleLanguage) {
    if (i18n.language !== lang) {
      setOpenToast(true)
    }
    i18n.changeLanguage(lang)
    tracker.trackEvent({
      category: 'Language',
      action: 'Change Language',
      name: lang,
    })
    setShowLocales(false)
    if (mobile) {
      dispatch(actions.toggleSidebar())
    }
  }

  useEffect(() => {
    if (!sideBarOpen) {
      setShowLocales(false)
    }
  }, [sideBarOpen])

  return (
    <>
      <MenuItem
        icon="language"
        label={t('sidebar.tools.language')}
        showTooltip={!sideBarOpen}
        level={0}
        onClick={handleMenuClick}
        onExpand={mobile && !showLocales ? handleMenuClick : undefined}
        onCollapse={mobile && showLocales ? handleMenuClick : undefined}
        id={'languageSwitch'}
      />
      {showLocales &&
        Object.keys(languages).map((locale) => {
          const _locale = locale as WebModuleLanguage
          return (
            <MenuItem
              key={`language-selection-button-${_locale}`}
              level={2}
              label={languages[_locale]}
              onClick={() => handleLocaleSelected(_locale)}
              selected={i18n.language === _locale}
            />
          )
        })}
      {!mobile && (
        <Toast
          open={openToast}
          handleClose={handleToastClose}
          message={t('snackMsg.language')}
        />
      )}
    </>
  )
}
