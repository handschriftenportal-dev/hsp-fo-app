import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { Search as SearchModule } from 'src/components/search/Main/index'
import { searchActions } from 'src/contexts/actions/searchActions'
import { useSetupModulesForPage } from 'src/contexts/modules'
import { searchSelectors } from 'src/contexts/selectors'
import { useTrackPageView } from 'src/contexts/tracking'
import {
  ParsedSearchParams,
  useParsedSearchParams,
} from 'src/utils/searchparams'

export function Search() {
  const dispatch = useDispatch()
  const params: ParsedSearchParams = useParsedSearchParams()
  const { hspobjectid, fromWorkspace } = params
  const searchParams = useSelector(searchSelectors.getSearchParams)
  const location = useLocation()

  useSetupModulesForPage()
  useTrackPageView('Search')

  useEffect(() => {
    if (location.pathname === '/search') {
      if (params.fromWorkspace) {
        const newParams = {
          ...searchParams,
          hspobjectid,
          fromWorkspace,
        }
        dispatch(searchActions.setSearchParams(newParams))
      } else {
        dispatch(searchActions.setSearchParams(params))
      }
    }
  }, [params])

  return <SearchModule />
}
