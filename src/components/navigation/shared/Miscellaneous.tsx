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
import ListItem from '@material-ui/core/ListItem'
import { Link } from 'react-router-dom'
import { relative } from 'src/utils/relative'
import List from '@material-ui/core/List'
import { actions, useDispatch } from 'src/contexts/state'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: 0,
    listStyleType: 'none',
    fontWeight: 400,
    fontSize: 14,
  },
  link: {
    color: '#202020',
    padding: 0,
    textDecoration: 'underline',
  },
  notShow: {
    height: 0,
    width: 'unset',
    padding: 'unset',
    position: 'unset',
    listStyle: 'unset',
    overflow: 'hidden',
  },
}))

interface Props {
  mobile: boolean
  className?: string
  show: boolean
}

export function Miscellaneous({ className, show, mobile }: Props) {
  const dispatch = useDispatch()
  const cls = useStyles()
  const { t } = useTranslation()

  return (
    <List
      className={show ? clsx(cls.root, className) : cls.notShow}
      component="nav"
    >
      <ListItem
        button={true}
        className={cls.link}
        component={Link}
        role="link"
        onClick={() => mobile && dispatch(actions.toggleSidebar())}
        tabIndex={show ? 0 : -1}
        to={relative(t('links.legal'))}
      >
        {t('sidebar.misc.legal')}
      </ListItem>
      <ListItem
        button={true}
        className={cls.link}
        component={Link}
        role="link"
        onClick={() => mobile && dispatch(actions.toggleSidebar())}
        to={relative(t('links.accessibility'))}
        id="accessibility"
        tabIndex={show ? 0 : -1}
      >
        {t('sidebar.misc.accessibility')}
      </ListItem>
    </List>
  )
}
