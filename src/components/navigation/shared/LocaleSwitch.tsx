import { WebModuleLanguage } from 'hsp-web-module'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { actions } from 'src/contexts/actions/actions'
import { useTranslation } from 'src/contexts/i18n'
import { useTracker } from 'src/contexts/tracking'

import { MenuItem } from './MenuItem'
import { Toast } from './Toast'

const languages: Record<WebModuleLanguage, string> = {
  de: 'Deutsch',
  en: 'English',
}

interface Props {
  sideBarOpen: boolean
  mobile: boolean
}

export function LocaleSwitch(props: Readonly<Props>) {
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
          message={t('notifications.language')}
        />
      )}
    </>
  )
}
