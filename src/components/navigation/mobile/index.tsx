import clsx from 'clsx'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { makeStyles } from 'tss-react/mui'

import Slide from '@mui/material/Slide'
import useScrollTrigger from '@mui/material/useScrollTrigger'

import CookieBanner from '../shared/CookieBanner'
import { Footer } from '../web/Footer'
import { ScrollContainerContext } from './ScrollContainerContext'
import { TopBar } from './TopBar'

interface HideOnScrollProps {
  children: React.ReactElement
  target?: HTMLElement
}

function HideOnScroll(props: Readonly<HideOnScrollProps>) {
  const { children, target } = props
  const trigger = useScrollTrigger({ target })
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}

const useStyle = makeStyles()(() => ({
  root: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  wrapperHome: {
    minHeight: '100%',
  },
  topBar: {
    position: 'sticky',
    width: '100%',
    top: 0,
    flexShrink: 0,
  },
  main: {
    flexGrow: 1,
    position: 'relative',
    flexShrink: 0,
    minHeight: 'calc( 100vh - 80px )',
  },
}))

interface Props {
  className?: string
  Outlet: React.ReactElement
}

export function MobileNavigation(props: Readonly<Props>) {
  const { classes: cls } = useStyle()
  const mainRef = useRef<HTMLElement>(null)
  const navigationRef = useRef<HTMLDivElement>(null)
  const [scrollTarget, setScrollTarget] = useState<HTMLDivElement>()
  const location = useLocation()

  const isInWorkspace = location.pathname.includes('workspace')

  useEffect(() => {
    // navigationRef.current can go from null to a scrollable element without a
    // re-render; tracking it in state keeps useScrollTrigger's target current.
    setScrollTarget(navigationRef.current ?? undefined)
  }, [navigationRef.current])

  return (
    <div
      data-testid="navigation-mobile"
      ref={navigationRef}
      className={clsx(cls.root, props.className)}
    >
      <ScrollContainerContext.Provider value={scrollTarget ?? null}>
        <div
          className={clsx(cls.wrapper, {
            [cls.wrapperHome]: location.pathname === '/',
          })}
        >
          <HideOnScroll target={scrollTarget}>
            <TopBar className={cls.topBar} />
          </HideOnScroll>
          <Suspense fallback={null}>
            <main ref={mainRef} className={cls.main}>
              {props.Outlet}
            </main>
          </Suspense>
          <CookieBanner />
          {!isInWorkspace && <Footer />}
        </div>
      </ScrollContainerContext.Provider>
    </div>
  )
}
