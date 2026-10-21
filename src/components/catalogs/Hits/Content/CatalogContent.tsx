import { useState } from 'react'
import { makeStyles } from 'tss-react/mui'

import { CatalogItemProps, CatalogsByQueryInput } from 'src/contexts/discovery'
import { useCatalogHighlighting } from 'src/contexts/discovery/useCatalogHighlighting'
import { useParsedSearchParams } from 'src/utils/searchparams'

import { exludedIfEmptyFields, hitKeyDataCatalog } from '../../config'
import { ContentEntry } from './ContentEntry'
import { FullTextHighlight } from './FullTextHighlight'

const useStyles = makeStyles()(() => ({
  content: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  textual: {
    display: 'flex',
    flexDirection: 'column',
  },
}))

interface CatalogContentProps {
  catalog: CatalogItemProps
  index?: number
}

export function CatalogContent({
  catalog,
  index,
}: Readonly<CatalogContentProps>) {
  const { classes: cls } = useStyles()
  const { q, fq } = useParsedSearchParams()
  const [highlighting, setHighlighting] = useState<string[]>()

  const queryInput = {
    q,
    fq: JSON.stringify(fq),
    start: index,
  } as CatalogsByQueryInput

  const { refetch: refetchHighlighting, isFetching: loading } =
    useCatalogHighlighting(catalog.id, queryInput)

  const handleContextLoading = () => {
    refetchHighlighting().then(({ data }) => {
      const highlights =
        data?.metadata.highlighting?.[catalog.id]?.['fulltext-search']
      if (highlights) {
        setHighlighting(highlights)
      }
    })
  }

  return (
    <div className={cls.content}>
      <div className={cls.textual}>
        {hitKeyDataCatalog.map((field) => {
          const isExcluded =
            exludedIfEmptyFields.includes(field) && !catalog[field]
          const isFulltextWithoutQuery = field.includes('fulltext') && !q

          if (isExcluded || isFulltextWithoutQuery) return null

          if (field.includes('fulltext')) {
            return (
              <FullTextHighlight
                key={field}
                highlighting={highlighting}
                loading={loading}
                handleContextLoading={handleContextLoading}
              />
            )
          }

          return <ContentEntry catalog={catalog} field={field} key={field} />
        })}
      </div>
    </div>
  )
}
