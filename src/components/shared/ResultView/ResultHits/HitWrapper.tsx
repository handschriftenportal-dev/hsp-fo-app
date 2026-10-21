import clsx from 'clsx'
import React from 'react'
import { makeStyles } from 'tss-react/mui'

import Paper from '@mui/material/Paper'

const useStyles = makeStyles()((theme) => ({
  root: {
    zIndex: 1,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(3),
    scrollMarginTop: '200px',
    scrollBehavior: 'smooth',
  },
}))

interface Props {
  className?: string
  children: React.JSX.Element
}

export function HitWrapper(props: Readonly<Props>) {
  const { classes: cls } = useStyles()
  const { className, children } = props

  return (
    <Paper
      data-testid="discovery-list-view-hits-key-data"
      className={clsx(cls.root, 'addFocusable', className)}
      square
      elevation={24}
      id="searchHit"
      tabIndex={-1}
    >
      {children}
    </Paper>
  )
}
