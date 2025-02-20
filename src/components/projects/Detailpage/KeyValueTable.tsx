import React from 'react'

import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import { useTranslation } from 'src/contexts/i18n'

import { Contacts } from './Contacts'
import { ProjectLinks } from './ProjectLinks'

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: '32px',
    marginTop: '32px',
  },
  row: {
    borderTop: '1px solid #444',
    display: 'grid',
    gap: theme.spacing(4),
    gridTemplateColumns: 'minmax(100px, 1fr) 3fr',
    hyphens: 'auto',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
    wordBreak: 'break-word',
  },
}))

interface Props {
  className?: string
  data: Record<string, string>
}

export function KeyValueTable({ className, data }: Readonly<Props>) {
  const cls = useStyles()
  const { t } = useTranslation()

  return (
    <div className={className}>
      {Object.keys(data).map((key) => (
        <div className={cls.row} key={key}>
          <Typography variant="body2">{t('projects.table.' + key)}</Typography>
          <Typography component={'span'} variant="body1">
            {(key === 'links' && <ProjectLinks links={data[key]} />) ||
              (key === 'contact' && <Contacts contact={data[key]} />) ||
              data[key]}
          </Typography>
        </div>
      ))}
    </div>
  )
}
