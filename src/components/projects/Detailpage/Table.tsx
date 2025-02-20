import clsx from 'clsx'
import React from 'react'

import Paper from '@material-ui/core/Paper'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import { getTableObject } from 'src/components/projects/utils/projectsUtils'
import { AcfProject } from 'src/contexts/wordpress'

import { dataTableFieldsLeft, dataTableFieldsRight } from '../config'
import { KeyValueTable } from './KeyValueTable'

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '32px',
    marginBottom: '32px',
    display: 'flex',
    padding: theme.spacing(8),
    justifyContent: 'center',
  },
  subTableLeft: {
    marginRight: theme.spacing(8),
    flexBasis: '50%',
  },
  subTableRight: {
    flexBasis: '50%',
  },
}))

interface Props {
  className?: string
  project: AcfProject | undefined
}

export default function Table(props: Props) {
  const cls = useStyles()
  const theme = useTheme()
  const { project, className } = props
  const dataLeft = getTableObject(dataTableFieldsLeft, project)
  const dataRight = getTableObject(dataTableFieldsRight, project)
  const narrow = useMediaQuery(theme.breakpoints.down('md'), {
    defaultMatches: true,
    noSsr: true,
  })

  const renderNarrow = () => (
    <Paper className={clsx(cls.root, className)} square>
      <KeyValueTable data={{ ...dataLeft, ...dataRight }} />
    </Paper>
  )

  const renderWide = () => (
    <Paper className={clsx(cls.root, props.className)} square>
      <KeyValueTable className={cls.subTableLeft} data={dataLeft} />
      <KeyValueTable className={cls.subTableRight} data={dataRight} />
    </Paper>
  )

  return (narrow ? renderNarrow : renderWide)()
}
