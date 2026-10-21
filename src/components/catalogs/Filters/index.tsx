import clsx from 'clsx'
import React, { useEffect, useRef, useState } from 'react'
import { Await, useLoaderData } from 'react-router'
import { makeStyles } from 'tss-react/mui'

import MuiGrid from '@mui/material/GridLegacy'

import { ActiveFilters } from 'src/components/shared/Filter/ActiveFilters'
import { Grid } from 'src/components/shared/Grid'
import { DiscoveryLoaderDataProps } from 'src/contexts/loader'

import { orderCatalogFacets } from '../config'
import { CatalogAccordion } from './CatalogAccordion'
import { FullTextSearch } from './FullTextSearch'

const useStyles = makeStyles()((theme) => ({
  activeFilters: {
    paddingBottom: theme.spacing(1),
  },
  facetContainer: {
    paddingTop: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
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
  const { classes: cls } = useStyles()
  const { searchResult } = useLoaderData() as DiscoveryLoaderDataProps
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth - 24)
      }
    }

    const observer = new ResizeObserver(updateWidth)
    if (containerRef.current) observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [])

  return (
    <div className={cls.root}>
      <div
        className={clsx('addFocusableWithOutline', cls.filterOptions)}
        id="filterOptions"
        tabIndex={-1}
      >
        <Await resolve={searchResult}>
          <Grid>
            <MuiGrid
              container
              className={cls.facetContainer}
              spacing={2}
              ref={containerRef}
            >
              <MuiGrid item xs={12} sm={3}>
                <FullTextSearch containerWidth={containerWidth} />
              </MuiGrid>
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
