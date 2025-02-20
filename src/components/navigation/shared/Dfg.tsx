import React from 'react'

import Link from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/core/styles'

import { useTranslation } from 'src/contexts/i18n'
import { Tooltip } from 'src/utils/Tooltip'

const useStyles = makeStyles((theme) => ({
  logoDfg: {
    width: '230px',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(0.5),
    },
  },
}))

export function Dfg() {
  const cls = useStyles()
  const { t, i18n } = useTranslation()

  return (
    <Link
      href={t('dfg.link')}
      target="blank"
      rel="noreferrer"
      className={'addFocusableWithWhiteOutline'}
    >
      <Tooltip title={t('dfg.tooltip')}>
        <img
          alt="dfg"
          className={cls.logoDfg}
          src={`/img/dfg_logo_schriftzug_recolored_foerderung_${i18n.resolvedLanguage}.png`}
        />
      </Tooltip>
    </Link>
  )
}
