import clsx from 'clsx'
import React, { useEffect, useRef } from 'react'
import { useLoaderData } from 'react-router-dom'

import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import { ProjectsLoaderDataProps } from 'src/contexts/loader'

import { Description } from './Description'
import { Manuscripts } from './Manuscripts'
import { Metatags } from './Metatags'
import { Overview } from './Overview'
import { Publications } from './Publications'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    scrollMarginTop: '200px',
    scrollBehavior: 'smooth',
  },
}))

interface Props {
  className?: string
}

export function DetailPage(props: Readonly<Readonly<Props>>) {
  const { className } = props
  const cls = useStyles()
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('xs'), { noSsr: true })
  const { project } = useLoaderData() as ProjectsLoaderDataProps

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (mobile && ref.current) {
      ref.current.scrollIntoView()
    }
  }, [])

  return (
    <div className={clsx(cls.root, className)} ref={ref}>
      <Metatags project={project} />
      <Overview project={project} />
      <Description project={project} />
      <Manuscripts project={project} />
      <Publications project={project} />
    </div>
  )
}
