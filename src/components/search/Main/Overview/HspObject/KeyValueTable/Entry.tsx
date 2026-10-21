import React from 'react'
import { makeStyles } from 'tss-react/mui'

import Typography from '@mui/material/Typography'

import { KeyValueData } from 'src/components/search/utils/makeKeyValueData'

const useStyles = makeStyles()((theme) => ({
  span: {
    display: 'block',
    '&:not(:last-child)': {
      marginBottom: theme.spacing(0.5),
    },
  },
}))

interface EntryProps {
  objectKey: string
  data: KeyValueData
}

export function Entry({ objectKey, data }: Readonly<EntryProps>) {
  const { classes: cls } = useStyles()
  const value = data[objectKey]
  return (
    <>
      {Array.isArray(value) ? (
        <Typography variant="body1">
          {value.map((elem) => (
            <span className={cls.span} key={elem}>
              {elem}
            </span>
          ))}
        </Typography>
      ) : (
        <Typography variant="body1">{value as React.ReactNode}</Typography>
      )}
    </>
  )
}
