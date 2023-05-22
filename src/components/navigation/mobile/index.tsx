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

import React, { useRef, useEffect, useState } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import { TopBar } from './TopBar'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import Slide from '@material-ui/core/Slide'

interface HideOnScrollProps {
  children: React.ReactElement
  navigationRef: React.RefObject<HTMLDivElement>
}

function HideOnScroll(props: HideOnScrollProps) {
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
  topBar: {
    position: 'sticky',
    width: '100%',
    top: 0,
  },
  main: {
    flexGrow: 1,
    position: 'relative',
  },
}))

interface Props {
  className?: string
  main?: Element
  topBarTools?: Element
}

export function MobileNavigation(props: Props) {
  const cls = useStyle()
  const mainRef = useRef<HTMLElement>(null)
  const navigationRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (mainRef.current && props.main) {
      mainRef.current.appendChild(props.main)
    }
  }, [])
  return (
    <div
      data-testid="navigation-mobile"
      ref={navigationRef}
      className={clsx(cls.root, props.className)}
    >
      <HideOnScroll {...props} navigationRef={navigationRef}>
        <TopBar topBarTools={props.topBarTools} className={cls.topBar} />
      </HideOnScroll>
      <main ref={mainRef} className={cls.main} />
    </div>
  )
}
