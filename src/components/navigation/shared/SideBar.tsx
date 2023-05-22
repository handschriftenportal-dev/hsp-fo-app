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
import { Link } from 'react-router-dom'
import Divider from '@material-ui/core/Divider'
import { SideBarButton } from '../shared/SideBarButton'
import { Menu } from '../shared/Menu'
import { GlobalTools } from '../shared/GlobalTools'
import { Miscellaneous } from '../shared/Miscellaneous'
import { useTranslation } from 'src/contexts/i18n'
import {
  actions,
  selectors,
  useDispatch,
  useSelector,
} from 'src/contexts/state'
import { Dfg } from '../shared/Dfg'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    height: 'inherit',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  misc: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}))

interface Props {
  className?: string
  mobile: boolean
}

export function SideBar(props: Props) {
  const dispatch = useDispatch()
  const sidebarOpen = useSelector(selectors.getSidebarOpen)
  const cls = useStyles()
  const { t } = useTranslation()

  return (
    <div
      className={clsx(cls.root, props.className)}
      role="region"
      aria-label={t('sidebar.sidebar')}
    >
      <div>
        {props.mobile && (
          <div className={cls.header}>
            <Link
              to="/"
              aria-label={t('topBar.logoLink')}
              onClick={() => dispatch(actions.toggleSidebar())}
            >
              <img
                src="/img/handschriftenportal_logo.svg"
                width="200"
                alt={t('logo')}
              />
            </Link>
            <SideBarButton />
          </div>
        )}
        <Menu mobile={props.mobile} />
      </div>
      <div>
        <GlobalTools mobile={props.mobile} />
        <Divider />
        <Miscellaneous
          mobile={props.mobile}
          className={cls.misc}
          show={sidebarOpen}
        />
        <Dfg show={sidebarOpen} />
      </div>
    </div>
  )
}
