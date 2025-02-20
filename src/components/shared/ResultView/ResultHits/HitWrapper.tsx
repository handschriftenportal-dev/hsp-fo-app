import clsx from 'clsx'
import React from 'react'

import Paper from '@material-ui/core/Paper'
import makeStyles from '@material-ui/core/styles/makeStyles'

const useStyles = makeStyles((theme) => ({
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
  const cls = useStyles()
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
