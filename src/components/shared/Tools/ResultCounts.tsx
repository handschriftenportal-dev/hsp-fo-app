import React from 'react'
import { useAsyncValue } from 'react-router-dom'

import Typography from '@material-ui/core/Typography'

import { useSearchTranslation } from 'src/components/search/utils'
import { DiscoveryLoaderDataProps } from 'src/contexts/loader'
import { useGetLocationType } from 'src/utils/useGetLocationType'

interface Props {
  className?: string
}

export function ResultCounts(props: Readonly<Props>) {
  const { className } = props
  const { searchResult } = useAsyncValue() as DiscoveryLoaderDataProps
  const locationType = useGetLocationType()
  const { searchTT } = useSearchTranslation()

  const results =
    locationType === 'catalogs'
      ? searchTT(
          {
            numFound: searchResult.metadata.numFound.toString(),
          },
          'numberOfHitsCatalogs',
        )
      : searchTT(
          {
            numFound: searchResult.metadata.numFound.toString(),
          },
          'numberOfHits',
        )

  return (
    <div className={className}>
      <Typography variant="h1">{results}</Typography>
    </div>
  )
}
