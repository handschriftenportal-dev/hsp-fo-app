import React from 'react'

import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import { SinglePagePaper } from 'src/components/shared'
import { HspObject } from 'src/contexts/discovery'

import { dataTableFieldsLeft, dataTableFieldsRight } from '../../../config'
import { useSearchTranslation } from '../../../utils'
import { makeKeyValueData } from '../../../utils/makeKeyValueData'
import { KeyValueTable } from './KeyValueTable'

const useStyles = makeStyles((theme) => ({
  subTableLeft: {
    marginRight: theme.spacing(8),
    flexBasis: '50%',
  },
  subTableRight: {
    flexBasis: '50%',
  },
}))

interface Props {
  hspObject: HspObject
}

export function HspObjectDataTable({ hspObject }: Readonly<Props>) {
  const cls = useStyles()
  const theme = useTheme()
  const { searchT } = useSearchTranslation()

  const narrow = useMediaQuery(theme.breakpoints.down('md'), {
    // to prevent unwanted layout effects while auto-scrolling to the resource
    // sections of the overview page we render the narrow (heigher) variant by
    // default.
    defaultMatches: true,
    noSsr: true,
  })

  const dataLeft = makeKeyValueData(dataTableFieldsLeft, hspObject, searchT)
  const dataRight = makeKeyValueData(dataTableFieldsRight, hspObject, searchT)

  const renderNarrow = <KeyValueTable data={{ ...dataLeft, ...dataRight }} />

  const renderWide = (
    <>
      <KeyValueTable className={cls.subTableLeft} data={dataLeft} />
      <KeyValueTable className={cls.subTableRight} data={dataRight} />
    </>
  )

  return <SinglePagePaper>{narrow ? renderNarrow : renderWide}</SinglePagePaper>
}
