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
    let mounted = true
    if (!hasFetched) {
      fetch(url)
        .then((res) => res.json())
        .then((fetchedInfo) => {
          /**
           *  As we only want the fields where a group is defined we iterate over the fields groups.
           *  Note:
           *  - fetched info can be greater then our inital groups.
           *  - groups include group 0 which is not served from info/fields endpoint.
           */
          const enrichedInfo = extFieldGroups.map((item) => {
            const match = findMatch(item, fetchedInfo)
            return match ? { ...item, ...match } : item
          })
          setExtFields(enrichedInfo)
          dispatch(searchActions.setHasFetchedExtFieldInfo(true))
        })
        .catch((error) => {
          if (mounted) {
            setError(error)
          }
        })

      return () => {
        mounted = false
      }
    }
  }, [])

  return { extFields, error }
}
