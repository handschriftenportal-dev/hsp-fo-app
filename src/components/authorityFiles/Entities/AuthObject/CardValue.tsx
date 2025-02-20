import React from 'react'

import Typography from '@material-ui/core/Typography'

export function CardValue(value: unknown) {
  if (Array.isArray(value)) {
    return (
      <>
        {value.map((item) => (
          <Typography variant="body1" key={`${item.name}_${item.languageCode}`}>
            {item.name} {item.languageCode && '<' + item.languageCode + '>'}
          </Typography>
        ))}
      </>
    )
  } else {
    return <Typography variant="body1">{value}</Typography>
  }
}
