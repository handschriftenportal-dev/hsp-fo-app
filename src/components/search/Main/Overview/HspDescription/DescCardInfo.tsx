import React from 'react'

import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/core/styles/makeStyles'

import { getAuthorDateLine } from 'src/components/search/shared/getAuthorDateLine'
import { HspDescription } from 'src/contexts/discovery'

const useStyles = makeStyles(() => ({
  hspId: {
    fontWeight: 350,
  },
}))

export function CardInfo({ desc }: Readonly<{ desc: HspDescription }>) {
  const authorDateLine = getAuthorDateLine(desc)
  const cls = useStyles()
  return (
    <div id="descCardInfo">
      <Typography>{authorDateLine}</Typography>
      <Typography gutterBottom>{desc['title-display']}</Typography>
      <Typography variant="body2" className={cls.hspId}>
        {desc.id}
      </Typography>
    </div>
  )
}
