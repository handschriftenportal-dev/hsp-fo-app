import React from 'react'

import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/core/styles/makeStyles'

const useStyles = makeStyles((theme) => ({
  span: {
    display: 'block',
    '&:not(:last-child)': {
      marginBottom: theme.spacing(0.5),
    },
  },
}))

interface EntryProps {
  objectKey: string
  data: Record<string, unknown>
}

export function Entry({ objectKey, data }: Readonly<EntryProps>) {
  const cls = useStyles()
  return (
    <>
      {Array.isArray(data[objectKey]) ? (
        <Typography variant="body1">
          {data[objectKey].map((elem) => (
            <span className={cls.span} key={elem}>
              {elem}
            </span>
          ))}
        </Typography>
      ) : (
        <Typography variant="body1">{data[objectKey]}</Typography>
      )}
    </>
  )
}
