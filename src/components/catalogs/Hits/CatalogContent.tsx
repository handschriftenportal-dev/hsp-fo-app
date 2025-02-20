import React from 'react'

import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/core/styles/makeStyles'

import { useSearchTranslation } from 'src/components/search/utils'
import { CatalogItemProps } from 'src/contexts/discovery'

import { hitKeyDataCatalog } from '../config'

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  textual: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'grid',
    gap: theme.spacing(4),
    gridTemplateColumns: 'minmax(100px, 1fr) 3fr',
    hyphens: 'auto',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
    wordBreak: 'break-word',
  },
}))

interface CatalogContentProps {
  catalog: CatalogItemProps
}
export function CatalogContent(props: Readonly<CatalogContentProps>) {
  const cls = useStyles()
  const { catalog } = props

  const { searchT } = useSearchTranslation()

  return (
    <div className={cls.content}>
      <div className={cls.textual}>
        {hitKeyDataCatalog.map((field) => (
          <div key={field} className={cls.row}>
            <Typography variant="body2">
              {searchT('data', field, '__field__')}
            </Typography>
            <Typography component={'span'} variant="body1">
              {Array.isArray(catalog[field])
                ? catalog[field].join(', ')
                : catalog[field]}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  )
}
