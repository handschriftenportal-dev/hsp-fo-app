import clsx from 'clsx'
import { useEffect, useRef } from 'react'
import { useLoaderData } from 'react-router'
import { makeStyles } from 'tss-react/mui'

import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import { ProjectsLoaderDataProps } from 'src/contexts/loader'

import { Description } from './Description'
import { Manuscripts } from './Manuscripts'
import { Metatags } from './Metatags'
import { Overview } from './Overview'
import { Publications } from './Publications'

const useStyles = makeStyles()(() => ({
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
  const { classes: cls } = useStyles()
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true })
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
