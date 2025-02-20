import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useAsyncValue, useLocation, useNavigate } from 'react-router-dom'

import { searchActions } from 'src/contexts/actions/searchActions'
import { AuthorityDataProps } from 'src/contexts/loader'
import { useParsedSearchParams } from 'src/utils/searchparams'

import { NormOverViewSkeleton } from '../shared/Skeletons/NormOverviewSkeleton'
import { Entity } from './Entities'
import { EntityType } from './Entities/AuthObject'
import { getAuthorityEntityType } from './utils/getAuthorityEntityType'

export function NormOverview() {
  const { authorityfileid } = useParsedSearchParams()
  const dispatch = useDispatch()
  const { hash } = useLocation()
  const navigate = useNavigate()
  const [entityType, setEntityType] = useState<EntityType>()

  const asyncValue = useAsyncValue() as AuthorityDataProps

  const { authItem, numFound } = asyncValue || {}

  useEffect(() => {
    if (hash === '#authority') {
      const desc = document.getElementById('authorityFileResult')
      desc?.scrollIntoView()
      desc?.focus()
    } else {
      window.scrollTo(0, 0)
    }
  }, [authItem, hash])

  useEffect(() => {
    if (authItem) {
      const entityType = getAuthorityEntityType(authItem.typeName)
      if (!entityType) {
        navigate(`/search?q=%22${authorityfileid}%22`)
        dispatch(searchActions.setAuthorityId(''))
      } else {
        dispatch(searchActions.setAuthorityId(authItem.id))
        setEntityType(entityType)
      }
    }
  }, [authItem])

  useEffect(() => {
    if (authorityfileid) {
      dispatch(searchActions.setAuthorityId(authorityfileid))
    }
  }, [authorityfileid])

  if (!asyncValue) {
    return <NormOverViewSkeleton />
  }

  return (
    <Entity
      authItem={authItem}
      numFound={numFound}
      entityType={entityType as EntityType}
    />
  )
}
