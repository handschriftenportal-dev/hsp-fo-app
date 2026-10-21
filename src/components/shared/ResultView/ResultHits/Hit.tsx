import clsx from 'clsx'
import { makeStyles } from 'tss-react/mui'

import { KeyDataCatalog } from 'src/components/catalogs/Hits'
import { KeyDataSearch } from 'src/components/search/Main/ListView/Hits'
import {
  CatalogItemProps,
  Highlighting,
  HspObjectGroup,
} from 'src/contexts/discovery'

const useStyles = makeStyles()(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
}))

interface HitProps {
  className?: string
  entry: HspObjectGroup | CatalogItemProps
  highlighting: Highlighting
  index?: number
}

export function Hit({
  className,
  entry,
  highlighting,
  index,
}: Readonly<HitProps>) {
  const { classes: cls } = useStyles()

  return (
    <div className={clsx(cls.root, className)}>
      {'hspDescriptions' in entry ? (
        <KeyDataSearch entry={entry} highlighting={highlighting} />
      ) : (
        <KeyDataCatalog entry={entry} index={index} />
      )}
    </div>
  )
}
