import clsx from 'clsx'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

import Slide from '@material-ui/core/Slide'
import { makeStyles } from '@material-ui/core/styles'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'

import { Footer } from '../web/Footer'
import { TopBar } from './TopBar'

interface HideOnScrollProps {
  children: React.ReactElement
  navigationRef: React.RefObject<HTMLDivElement>
}

function HideOnScroll(props: Readonly<HideOnScrollProps>) {
  const { children, navigationRef } = props
  const [target, setTarget] = useState<HTMLDivElement>()
  useEffect(() => {
    // navigationRef.current sometimes changes from null to a scrollable HTMLDivElement
    // without a state update (& therefore rendering to update the target in useScrollTrigger)
    // using a state fixes that (e.g. when moving from home site to search with scrollable content)
    setTarget(navigationRef.current ? navigationRef.current : undefined)
  }, [navigationRef.current])
  const trigger = useScrollTrigger({ target })
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}

const useStyle = makeStyles(() => ({
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
    height: '100%',
  },
}))

interface Props {
  className?: string
  Outlet: React.ReactElement
}

export function MobileNavigation(props: Readonly<Props>) {
  const cls = useStyle()
  const mainRef = useRef<HTMLElement>(null)
  const navigationRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  const isInWorkspace = location.pathname.includes('workspace')

  return (
    <div
      data-testid="navigation-mobile"
      ref={navigationRef}
      className={clsx(cls.root, props.className)}
    >
      <div
        className={clsx(cls.wrapper, {
          [cls.wrapperHome]: location.pathname === '/',
        })}
      >
        <HideOnScroll {...props} navigationRef={navigationRef}>
          <TopBar className={cls.topBar} />
        </HideOnScroll>
        <Suspense fallback={null}>
          <main ref={mainRef} className={cls.main}>
            {props.Outlet}
          </main>
        </Suspense>
      </div>
      {!isInWorkspace && <Footer />}
    </div>
  )
}
