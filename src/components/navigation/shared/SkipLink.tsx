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

import React, { useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { actions, useDispatch } from 'src/contexts/state'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'src/contexts/i18n'

import { switchSkiplinks } from 'src/utils/switchSkipLinks'

const useStyles = makeStyles((theme) => ({
  entries: {
    cursor: 'pointer',
    color: 'inherit',
    padding: '45px',
    position: 'absolute',
    '&:focus-within': {
      backgroundColor: 'white',
    },
  },
  skiplinks: {
    '&:focus-within': {
      alignItems: 'center',
      display: 'flex',
      height: '20%',
      margin: theme.spacing(2),
      opacity: '0.9',
      position: 'fixed',
      transform: 'translateX(0)',
      width: '20%',
      zIndex: 2000,
    },
    [theme.breakpoints.down('xs')]: {
      transform: 'translateY(-120px)',
    },
  },
}))

export function SkipLink() {
  const cls = useStyles()
  const location = useLocation()
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const [skipList, setSkipList] = useState<string[]>()
  const skipLinkRef = useRef<HTMLDivElement>(null)

  const handleClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: string
  ) => {
    if (id === 'accessibility') {
      dispatch(actions.toggleSidebar())
    }
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      element.focus()
      e.preventDefault()
    }
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    id: string
  ) => {
    const element = document.getElementById(id)
    if (element && e.key === 'Enter') {
      if (id === 'accessibility') {
        dispatch(actions.toggleSidebar())
      }
      element.scrollIntoView({ behavior: 'smooth' })
      element.focus()
      e.preventDefault()
    }
  }

  useEffect(() => {
    const linkList = switchSkiplinks(location.pathname, location.search)
    setSkipList(linkList)
    if (location.hash === '') {
      skipLinkRef.current?.focus()
    }
  }, [location])

  // this effect has to be reworked once demodularisation is complete and app knows that filterDrawer = open
  useEffect(() => {
    window.addEventListener('transitionstart', function () {
      if (document.body.style.overflow === 'hidden') {
        setSkipList(undefined)
      }
    })
  })

  return (
    <div ref={skipLinkRef} tabIndex={-1}>
      {skipList?.map((links: string) => (
        <nav key={links} className={cls.skiplinks} id="skipLinks">
          <div
            className={cls.entries}
            tabIndex={0}
            onClick={(e) => handleClick(e, links)}
            onKeyDown={(e) => handleKeyDown(e, links)}
          >
            <div
              dangerouslySetInnerHTML={{ __html: t(`skiplinks.${links}`) }}
            />
          </div>
        </nav>
      ))}
    </div>
  )
}
