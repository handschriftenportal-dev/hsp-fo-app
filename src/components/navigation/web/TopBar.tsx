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

import React, { useRef, useEffect } from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import { useTranslation } from 'src/contexts/i18n'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    display: 'flex',
    flexDirection: 'row',
    height: theme.mixins.toolbar.minHeight,
    width: '100%',
    zIndex: theme.zIndex.drawer + 1,
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(6),
    [theme.breakpoints.up('sm')]: {
      paddingLeft: '55px',
    },
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'space-between',
    },
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.only('sm')]: {
      marginRight: '2%',
    },
    [theme.breakpoints.up('md')]: {
      marginRight: '10%',
      width: '25%',
    },
  },
  logo: {
    marginLeft: theme.spacing(4),
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      width: '59%',
    },
    [theme.breakpoints.down('md')]: {
      justifyContent: 'flex-end',
      width: '100%',
    },
    // classes coming from hsp-fo-search
    '& .searchSelect': {
      [theme.breakpoints.up('sm')]: {
        borderLeft: 'thin outset' + theme.palette.platinum.main,
      },
    },
    '& .searchAdvBtn': {
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
  },
}))

interface Props {
  className?: string
  sideBarOpen: boolean
  topBarTools?: Element
}

export function TopBar(props: Props) {
  const cls = useStyles()
  const { t } = useTranslation()
  const topBarToolsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (topBarToolsRef.current && props.topBarTools) {
      topBarToolsRef.current.appendChild(props.topBarTools)
    }
  }, [])

  return (
    <Paper
      component="header"
      className={clsx(cls.root, props.className)}
      elevation={24}
      square
    >
      <div className={cls.left}>
        <Link aria-label={t('topBar.logoLink')} to="/">
          <img
            className={cls.logo}
            src="/img/handschriftenportal_logo.svg"
            width="200"
            alt={t('topBar.logo')}
          />
        </Link>
      </div>
      <div ref={topBarToolsRef} className={cls.right} />
    </Paper>
  )
}
