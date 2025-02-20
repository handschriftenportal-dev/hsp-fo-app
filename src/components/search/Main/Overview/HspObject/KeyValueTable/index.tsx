import React from 'react'

import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import { isAuthorityEntry } from 'src/components/search/utils/isAuthorityEntryObject'
import { KeyValueData } from 'src/components/search/utils/makeKeyValueData'

import { Entry } from './Entry'
import { NormEntry } from './NormEntry'

const useStyles = makeStyles((theme) => ({
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

interface KeyValueTableProps {
  className?: string
  data: KeyValueData
}

export function KeyValueTable({
  className,
  data,
}: Readonly<KeyValueTableProps>) {
  const cls = useStyles()

  return (
    <div className={className}>
      {Object.keys(data).map((key) => (
        <div className={cls.row} key={key}>
          <Typography variant="body2">{key}:</Typography>
          {isAuthorityEntry(data[key]) ? (
            <NormEntry normEntry={data[key]} />
          ) : (
            <Entry data={data} objectKey={key} />
          )}
        </div>
      ))}
    </div>
  )
}
