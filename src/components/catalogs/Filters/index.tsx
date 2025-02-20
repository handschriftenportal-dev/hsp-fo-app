import clsx from 'clsx'
import React from 'react'
import { Await, useLoaderData } from 'react-router-dom'

import MuiGrid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'

import { ActiveFilters } from 'src/components/shared/Filter/ActiveFilters'
import { Grid } from 'src/components/shared/Grid'
import { DiscoveryLoaderDataProps } from 'src/contexts/loader'

import { orderCatalogFacets } from '../config'
import { CatalogAccordion } from './CatalogAccordion'

const useStyles = makeStyles((theme) => ({
  activeFilters: {
    paddingBottom: theme.spacing(1),
  },
  facetContainer: {
    paddingTop: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
    },
  },
  filterOptions: { scrollMarginTop: '200px' },
  root: {
    width: '100%',
    backgroundColor: theme.palette.liver.light,
  },
  marginTop: {
    marginTop: theme.spacing(0.5),
  },
}))

export const CatalogFilters: React.FC = () => {
  const cls = useStyles()
  const { searchResult } = useLoaderData() as DiscoveryLoaderDataProps

  return (
    <div className={cls.root}>
      <div
        className={clsx('addFocusableWithOutline', cls.filterOptions)}
        id="filterOptions"
        tabIndex={-1}
      >
        <Await resolve={searchResult}>
          <Grid>
            <MuiGrid container className={cls.facetContainer} spacing={2}>
              {orderCatalogFacets.map((facet) => (
                <MuiGrid item xs={12} sm={3} key={facet}>
                  <CatalogAccordion filterName={facet} />
                </MuiGrid>
              ))}
            </MuiGrid>
          </Grid>
        </Await>
      </div>
      <Grid>
        <div className={cls.activeFilters}>
          <ActiveFilters className={cls.marginTop} />
        </div>
      </Grid>
    </div>
  )
}
