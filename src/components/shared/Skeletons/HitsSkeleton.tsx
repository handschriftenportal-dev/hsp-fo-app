import React from 'react'

import makeStyles from '@material-ui/core/styles/makeStyles'
import Skeleton from '@material-ui/lab/Skeleton'

import { useSearchTranslation } from 'src/components/search/utils/searchI18n'
import { CatalogItemProps, HspObjectGroup } from 'src/contexts/discovery'

import { Hit } from '../ResultView/ResultHits/Hit'

const useStyles = makeStyles(() => ({
  skeleton: {
    maxWidth: 'unset',
    transform: 'scale(1)',
  },
}))
export function HitsSkeleton({
  ulStyle,
  spacing,
}: Readonly<{
  ulStyle: string
  spacing: string
}>) {
  const { searchT } = useSearchTranslation()
  const cls = useStyles()

  return (
    <ul className={ulStyle} aria-label={searchT('searchResults')}>
      {Array.from({ length: 10 }).map((_, index) => (
        <Skeleton className={cls.skeleton} key={index}>
          <li>
            <Hit
              className={spacing}
              entry={{} as HspObjectGroup | CatalogItemProps}
              highlighting={{}}
            />
          </li>
        </Skeleton>
      ))}
    </ul>
  )
}
