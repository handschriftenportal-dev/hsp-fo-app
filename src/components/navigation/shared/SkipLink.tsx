import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { ButtonBase } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { actions } from 'src/contexts/actions/actions'
import { useTranslation } from 'src/contexts/i18n'
import { switchSkiplinks } from 'src/utils'

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
  skipText: {
    fontSize: '16px',
    fontFamily:
      '"Roboto", "Helvetica", "Arial", sans-serif, "Junicode", "Junicode-Regular"',
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
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string,
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

  useEffect(() => {
    const linkList = switchSkiplinks(location.pathname, location.search)
    setSkipList(linkList)
    if (location.hash === '') {
      skipLinkRef.current?.focus({ preventScroll: true })
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
          <ButtonBase
            className={cls.entries}
            onClick={(e) => handleClick(e, links)}
          >
            <div
              className={cls.skipText}
              dangerouslySetInnerHTML={{ __html: t(`skiplinks.${links}`) }}
            />
          </ButtonBase>
        </nav>
      ))}
    </div>
  )
}
