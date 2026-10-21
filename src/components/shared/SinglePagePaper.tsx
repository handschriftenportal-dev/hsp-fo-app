import clsx from 'clsx'
import React from 'react'
import { makeStyles } from 'tss-react/mui'

import Paper from '@mui/material/Paper'

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    padding: theme.spacing(8),
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    [theme.breakpoints.only('xs')]: {
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
    },
  },
}))

interface Props {
  children: React.ReactElement | React.ReactElement[]
}

export function SinglePagePaper({ children }: Readonly<Props>) {
  const { classes: cls } = useStyles()

  return (
    <Paper className={clsx(cls.root)} square>
      {children}
    </Paper>
  )
}
