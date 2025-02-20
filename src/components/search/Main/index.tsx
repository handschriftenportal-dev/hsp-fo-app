import React from 'react'

import makeStyles from '@material-ui/core/styles/makeStyles'

import {
  ParsedSearchParams,
  useParsedSearchParams,
} from 'src/utils/searchparams'

import { ListView } from './ListView'
import { Overview } from './Overview'

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
  },
}))
export function Search() {
  const { hspobjectid }: ParsedSearchParams = useParsedSearchParams()
  const cls = useStyles()
  let children = null

  if (hspobjectid) {
    children = <Overview />
  } else {
    children = <ListView />
  }

  return (
    <div className={cls.root} id="hsp-search-main">
      {children}
    </div>
  )
}
