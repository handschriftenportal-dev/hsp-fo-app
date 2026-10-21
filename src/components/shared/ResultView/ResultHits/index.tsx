import clsx from 'clsx'
import { useAsyncValue, useNavigation } from 'react-router'
import { makeStyles } from 'tss-react/mui'

import { useSearchTranslation } from 'src/components/search/utils'
import { useSetMetatag, useSetTitle } from 'src/contexts/Metatags'
import { DiscoveryLoaderDataProps } from 'src/contexts/loader'
import { useParsedSearchParams } from 'src/utils/searchparams'

import { HitsSkeleton } from '../../Skeletons/HitsSkeleton'
import { Hit } from './Hit'

const useStyles = makeStyles()((theme) => ({
  root: {
    listStyle: 'none',
    // Reset the list's default block margin/padding, but do not set the top
    // margin here: the gap above the list comes from the caller (ViewContent's
    // marginTop). A `margin: 0` shorthand would clobber that marginTop under
    // Emotion's class ordering, where it loses (it won under v4's JSS), which
    // collapsed the pagination-to-results spacing to 0.
    marginBottom: 0,
    padding: 0,
  },
  spacing: {
    marginBottom: theme.spacing(3),
  },
}))

interface HitsProps {
  className?: string
}

export function Hits({ className }: Readonly<HitsProps>) {
  const { classes: cls } = useStyles()
  const { searchT, searchTT } = useSearchTranslation()

  const params = useParsedSearchParams()
  const asyncValue = useAsyncValue() as DiscoveryLoaderDataProps
  const navigation = useNavigation()

  const { searchResult } = asyncValue || {}

  const { numFound, start, rows } = searchResult?.metadata ?? {
    start: 0,
    rows: 0,
    numFound: 0,
  }

  const pageIndex = Math.floor(start / rows) + 1

  const titleDesc = `Handschriftenportal: ${searchT('searchResults')}`
  const descBeginning = searchTT(
    { numFound: numFound.toString() },
    'filterPanel',
    'filterResult',
  )
  const desc = `${descBeginning}. - ${searchT('paging', 'page')} ${pageIndex}.${
    params.q ? ` - "${params.q}"` : ''
  }`

  useSetTitle(titleDesc)
  useSetMetatag({ key: 'name', value: 'description', content: desc })

  if (!asyncValue || navigation.state === 'loading') {
    return (
      <HitsSkeleton ulStyle={clsx(cls.root, className)} spacing={cls.spacing} />
    )
  }

  return (
    <ul
      className={clsx(cls.root, className)}
      aria-label={searchT('searchResults')}
    >
      {searchResult.payload.map((entry, index) =>
        'hspObject' in entry ? (
          <li key={entry.hspObject.id}>
            <Hit
              className={cls.spacing}
              entry={entry}
              highlighting={searchResult.metadata.highlighting || {}}
            />
          </li>
        ) : (
          <li key={entry.id}>
            <Hit
              className={cls.spacing}
              entry={entry}
              index={index}
              highlighting={searchResult.metadata.highlighting || {}}
            />
          </li>
        ),
      )}
    </ul>
  )
}
