import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import makeStyles from '@material-ui/core/styles/makeStyles'

const useStyles = makeStyles(() => ({
  logo: {
    width: '200px',
  },
}))

export function Logo() {
  const cls = useStyles()
  const { t } = useTranslation()

  return (
    <Link
      className={'addFocusableWithOutline'}
      aria-label={t('topBar.logoLink')}
      to="/"
    >
      <img
        className={cls.logo}
        src="/img/handschriftenportal_logo.svg"
        alt={t('topBar.logo')}
      />
    </Link>
  )
}
