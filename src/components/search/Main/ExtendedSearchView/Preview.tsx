import React from 'react'

import { Typography, makeStyles } from '@material-ui/core'
import Box from '@material-ui/core/Box'

import { useSearchTranslation } from '../../utils'

const useStyles = makeStyles((theme) => ({
  preview: {
    [theme.breakpoints.only('xs')]: {
      paddingRight: theme.spacing(2),
      paddingLeft: theme.spacing(3.5),
    },
  },
}))

interface Props {
  preview: string
}

export default function Preview(props: Readonly<Props>) {
  const { searchT } = useSearchTranslation()

  const { preview } = props
  const cls = useStyles()

  return (
    <Box className={cls.preview}>
      <Typography>{searchT('extendedSearch', 'preview')}</Typography>
      <Box>{preview}</Box>
    </Box>
  )
}
