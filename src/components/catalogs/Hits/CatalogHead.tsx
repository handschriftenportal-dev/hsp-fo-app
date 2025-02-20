import React from 'react'

import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import { CatalogItemProps } from 'src/contexts/discovery'

const useStyles = makeStyles((theme) => ({
  headLeft: {
    width: '75%',
  },
  headTypography: {
    width: '100%',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}))

interface Props {
  catalog: CatalogItemProps
}

export function CatalogHead(props: Readonly<Props>) {
  const cls = useStyles()
  const { catalog } = props

  return (
    <div className={cls.headLeft}>
      <Typography variant="h2" className={cls.headTypography}>
        {catalog['title-display']}
      </Typography>
    </div>
  )
}
