import clsx from 'clsx'
import React, { ReactNode, Suspense, useEffect, useState } from 'react'
import { Await, useLoaderData } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'

import { ErrorPage } from 'src/components/shared/ErrorPage'
import { Grid } from 'src/components/shared/Grid'
import { DiscoveryLoaderDataProps } from 'src/contexts/loader'
import { useGetLocationType } from 'src/utils/useGetLocationType'

import { ViewContent } from './ViewContent'

const TIMEOUT_DURATION = 10000

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
  },
  catalog: {
    backgroundColor: theme.palette.action.selected,
  },
}))

interface ViewProps {
  FiltersComponent?: ReactNode
  NotificationComponent?: ReactNode
}

function handleSearchTimeout(
  searchResult: unknown,
  setShowError: React.Dispatch<React.SetStateAction<boolean>>,
) {
  if (typeof searchResult === 'undefined') {
    const timeoutId = setTimeout(() => {
      setShowError(true)
    }, TIMEOUT_DURATION)
    return () => clearTimeout(timeoutId)
  }
}
function renderErrorPage(locationType: string) {
  return <ErrorPage id={`discovery-${locationType}-view-timeout`} />
}

export function View({
  FiltersComponent,
  NotificationComponent,
}: Readonly<ViewProps>) {
  const cls = useStyles()
  const [showError, setShowError] = useState(false)

  const { searchResult } = useLoaderData() as DiscoveryLoaderDataProps
  const locationType = useGetLocationType()
  const isCatalogView = locationType === 'catalogs'

  useEffect(
    () => handleSearchTimeout(searchResult, setShowError),
    [searchResult],
  )

  if (showError) {
    return renderErrorPage(locationType)
  }

  return (
    <div className={isCatalogView ? clsx(cls.root, cls.catalog) : cls.root}>
      <Await resolve={searchResult}>{FiltersComponent}</Await>
      {NotificationComponent}
      <Grid id="searchGrid">
        <Suspense fallback={<ViewContent isSuspense={true} />}>
          <Await resolve={searchResult}>
            <ViewContent />
          </Await>
        </Suspense>
      </Grid>
    </div>
  )
}
