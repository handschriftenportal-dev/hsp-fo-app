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
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'src/contexts/i18n'
import { Tooltip } from 'src/utils/Tooltip'

const useStyles = makeStyles((theme) => ({
  logoDfg: {
    width: '231px',
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(1),
  },
  logoEn: {
    marginLeft: '-13px',
  },
  logoDe: {
    marginLeft: '-4px',
  },
}))

interface Props {
  className?: string
  show: boolean
}

export function Dfg({ show }: Props) {
  const cls = useStyles()
  const { t, i18n } = useTranslation()

  if (!show) {
    return null
  }

  return (
    <a href={t('dfg.link')} target="blank" rel="noreferrer">
      <Tooltip title={t('dfg.tooltip')}>
        {i18n.language === 'en' ? (
          <img
            className={clsx(cls.logoDfg, cls.logoEn)}
            src="/img/dfg_logo_schriftzug_schwarz_foerderung_en.jpg"
          />
        ) : (
          <img
            className={clsx(cls.logoDfg, cls.logoDe)}
            src="/img/dfg_logo_schriftzug_schwarz_foerderung_de.jpg"
          />
        )}
      </Tooltip>
    </a>
  )
}
