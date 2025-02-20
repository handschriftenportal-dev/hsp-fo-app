import clsx from 'clsx'
import React from 'react'

import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'

import { useGetLocationType } from 'src/utils/useGetLocationType'

import { HitListVariants } from './HitListVariants'
import { Paging } from './Paging'
import { Results } from './Results'
import { Selections } from './Selections'
import { SortOptionSelect } from './SortOptionSelect'

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: 'center',
    scrollMarginTop: '350px',
    [theme.breakpoints.only('xs')]: {
      paddingLeft: theme.spacing(3.5),
      paddingRight: theme.spacing(3.5),
    },
  },
  space: {
    marginTop: theme.spacing(2),
  },
}))

interface ToolsProps {
  className?: string
}

export function Tools(props: Readonly<ToolsProps>) {
  const { className } = props
  const cls = useStyles()

  return (
    <Grid
      data-testid="discovery-list-view-tools"
      className={clsx(cls.root, className, 'addFocusableWithOutline')}
      container
      justifyContent="space-between"
      id="pageNav"
      tabIndex={-1}
    >
      <Results className={cls.space} />
      <Grid className={cls.space} xs={12} sm={6} md={4} item>
        <Paging />
      </Grid>
      <Selections className={cls.space} />
    </Grid>
  )
}
