import clsx from 'clsx'
import React from 'react'

import makeStyles from '@material-ui/core/styles/makeStyles'

import { KeyDataCatalog } from 'src/components/catalogs/Hits'
import { KeyDataSearch } from 'src/components/search/Main/ListView/Hits'
import {
  CatalogItemProps,
  Highlighting,
  HspObjectGroup,
} from 'src/contexts/discovery'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
}))

interface HitProps {
  className?: string
  entry: HspObjectGroup | CatalogItemProps
  highlighting: Highlighting
}

export function Hit({ className, entry, highlighting }: Readonly<HitProps>) {
  const cls = useStyles()

  return (
    <div className={clsx(cls.root, className)}>
      {'hspDescriptions' in entry ? (
        <KeyDataSearch entry={entry} highlighting={highlighting} />
      ) : (
        <KeyDataCatalog entry={entry} />
      )}
    </div>
  )
}
