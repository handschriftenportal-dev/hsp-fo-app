import { useTranslation } from 'react-i18next'
import { makeStyles } from 'tss-react/mui'

import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

import { useSearchTranslation } from 'src/components/search/utils'
import { CatalogItemProps } from 'src/contexts/discovery'
import { Tooltip } from 'src/utils/Tooltip'

const useStyles = makeStyles()((theme) => ({
  row: {
    display: 'grid',
    gap: theme.spacing(4),
    gridTemplateColumns: '200px 1fr',
    hyphens: 'auto',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
    wordBreak: 'break-word',
    alignItems: 'start',
  },
  link: {
    cursor: 'pointer',
    textDecoration: 'underline',
    width: 'fit-content',
    // Was the Tooltip's `className`, which MUI applies to the child trigger;
    // kept on the child to preserve the row layout.
    display: 'flex',
  },
}))

interface ContentEntryProps {
  catalog: CatalogItemProps
  field: keyof CatalogItemProps
}

export function ContentEntry(props: Readonly<ContentEntryProps>) {
  const { classes: cls } = useStyles()
  const { catalog, field } = props

  const { searchT } = useSearchTranslation()
  const { t } = useTranslation()
  const isExternalLink = field.includes('catalog-external-url')

  const renderTextualRow = () => {
    return Array.isArray(catalog[field])
      ? catalog[field].join(', ')
      : catalog[field]
  }

  const renderLinkRow = () => {
    return (catalog[field] as string[]).map((entry) => (
      <Tooltip title={t('catalog.tooltip')} key={entry}>
        <Link
          className={cls.link}
          target="_blank"
          href={entry}
          rel="noreferrer"
          tabIndex={0}
        >
          {entry}
        </Link>
      </Tooltip>
    ))
  }

  return (
    <div key={field} className={cls.row}>
      <Typography variant="body2">
        {searchT('data', field, '__field__')}
      </Typography>
      <Typography component={'span'} variant="body1">
        {isExternalLink ? renderLinkRow() : renderTextualRow()}
      </Typography>
    </div>
  )
}
