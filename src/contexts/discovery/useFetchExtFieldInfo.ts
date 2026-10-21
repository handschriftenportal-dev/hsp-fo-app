import urlJoin from 'proper-url-join'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { searchActions } from '../actions/searchActions'
import { extFieldGroups } from '../reducer/extFieldGroups'
import { extSearchSelectors } from '../selectors'
import { discoveryEndpoint } from './'

const findMatch = (item: { name: string }, fetchedInfo: { name: string }[]) => {
  return fetchedInfo.find((groupItem) => groupItem.name === item.name)
}

export function useFetchExtFieldInfo() {
  const [error, setError] = useState<Error | undefined>()
  const [extFields, setExtFields] = useState(extFieldGroups)
  const hasFetched = useSelector(extSearchSelectors.getHasFetchedExtFields)
  const dispatch = useDispatch()

  useEffect(() => {
    const url = urlJoin(discoveryEndpoint, '/info/fields')
    const abortController = new AbortController()

    if (!hasFetched) {
      fetch(url, { signal: abortController.signal })
        .then((res) => res.json())
        .then((fetchedInfo) => {
          const enrichedInfo = extFieldGroups.map((item) => {
            const match = findMatch(item, fetchedInfo)
            return match ? { ...item, ...match } : item
          })
          setExtFields(enrichedInfo)
          dispatch(searchActions.setHasFetchedExtFieldInfo(true))
        })
        .catch((error) => {
          // AbortError ignorieren (wird beim Unmount geworfen)
          if (error.name !== 'AbortError') {
            setError(error)
          }
        })
    }

    return () => {
      abortController.abort()
    }
  }, [])

  return {
    extFields,
    error,
  }
}
