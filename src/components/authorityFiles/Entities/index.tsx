import React from 'react'

import makeStyles from '@material-ui/core/styles/makeStyles'

import { Grid } from 'src/components/shared'
import { AuthItemProps } from 'src/contexts/discovery'

import { AuthObject, EntityType } from './AuthObject'
import { AuthReference } from './AuthReference'

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

interface CorporateBodyProps {
  authItem: AuthItemProps
  numFound: number
  entityType: EntityType
}

export function Entity(props: Readonly<CorporateBodyProps>) {
  const cls = useStyles()
  const { authItem, entityType, numFound } = props

  return (
    <div className={cls.root}>
      <div className={cls.authItem}>
        <Grid>
          <AuthObject
            authItem={authItem}
            numFound={numFound.toString()}
            entityType={entityType}
          />
        </Grid>
      </div>
      <div className={cls.authItemCount}>
        <Grid>
          <AuthReference id={authItem.id} numFound={numFound.toString()} />
        </Grid>
      </div>
    </div>
  )
}
