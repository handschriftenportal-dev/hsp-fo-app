import React from 'react'

import makeStyles from '@material-ui/core/styles/makeStyles'
import Skeleton from '@material-ui/lab/Skeleton'

import {
  AuthObject,
  EntityType,
} from 'src/components/authorityFiles/Entities/AuthObject'
import { AuthReference } from 'src/components/authorityFiles/Entities/AuthReference'
import { Grid } from 'src/components/shared'
import { AuthItemProps } from 'src/contexts/discovery'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    scrollMarginTop: '350px',
  },
  authItem: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  authItemCount: {
    background: theme.palette.warmGrey.main,
    flexGrow: 1,
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
    [theme.breakpoints.only('xs')]: {
      paddingLeft: theme.spacing(3.5),
      paddingRight: theme.spacing(3.5),
    },
  },
}))
export function NormOverViewSkeleton() {
  const cls = useStyles()
  return (
    <div className={cls.root}>
      <div className={cls.authItem}>
        <Grid>
          <Skeleton>
            <AuthObject
              authItem={{} as AuthItemProps}
              numFound={'0'}
              entityType={'entityType' as EntityType}
            />
          </Skeleton>
        </Grid>
      </div>
      <div className={cls.authItemCount}>
        <Grid>
          <Skeleton>
            <AuthReference id={'id'} numFound={'0'} />
          </Skeleton>
        </Grid>
      </div>
    </div>
  )
}
