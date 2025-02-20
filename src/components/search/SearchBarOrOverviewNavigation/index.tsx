import React from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'

import { searchSelectors } from 'src/contexts/selectors'
import {
  ParsedSearchParams,
  useParsedSearchParams,
} from 'src/utils/searchparams'

import { OverviewNavigation } from '../OverviewNavigation'
import { SearchBar } from '../SearchBar'
import BackButton from '../shared/BackButton'
import BackWorkspaceButton from '../shared/BackWorkspaceButton'

const useStyles = makeStyles(() => ({
  backButton: {
    display: 'flex',
    justifyContent: 'end',
  },
}))

export function SearchBarOrOverviewNavigation() {
  const params: ParsedSearchParams = useParsedSearchParams()
  const searchParams = useSelector(searchSelectors.getSearchParams)

  const cls = useStyles()
  const { pathname } = useLocation()

  const backParams = {
    ...searchParams,
    hspobjectid: undefined,
    fromWorkspace: undefined,
  }

  if (pathname.includes('extended')) {
    return null
  }

  if (params.fromWorkspace) {
    return (
      <div id="resultNav" tabIndex={-1} className={cls.backButton}>
        <BackWorkspaceButton />
        <BackButton
          backParams={backParams}
          preventScrollReset={false}
          btnType="back"
        />
      </div>
    )
  }
  if (params.hspobjectid && !params.fromWorkspace) {
    return <OverviewNavigation />
  }
  return <SearchBar />
}
