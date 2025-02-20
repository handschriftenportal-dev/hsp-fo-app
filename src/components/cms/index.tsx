import clsx from 'clsx'
import React from 'react'
import { useLoaderData } from 'react-router-dom'
import root from 'react-shadow'

import MuiGrid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'

import { CMSLoaderDataProps } from 'src/contexts/loader/cms'

import { Grid } from '../shared/Grid'
import { Page } from './Page'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(4),
    [theme.breakpoints.up('xs')]: {
      padding: theme.spacing(0),
    },
  },
  content: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(8),
    paddingLeft: theme.spacing(8),
    paddingRight: theme.spacing(8),
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      paddingBottom: theme.spacing(2),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
}))

interface Props {
  className?: string
}

export function Cms({ className }: Readonly<Props>) {
  const cls = useStyles()

  const { page } = useLoaderData() as CMSLoaderDataProps

  return (
    <div className={clsx(cls.root, className)}>
      <Grid>
        <Paper className={cls.content} square>
          <MuiGrid item xs={12}>
            <root.div id="page-shadow-container">
              <Page wordpressPage={page[0]} />
            </root.div>
          </MuiGrid>
        </Paper>
      </Grid>
    </div>
  )
}
