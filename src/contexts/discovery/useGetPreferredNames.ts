import urlJoin from 'proper-url-join'
import { useEffect, useState } from 'react'

import { discoveryEndpoint } from './'

export function useGetPreferredNames(ids: string[]) {
  const [results, setResults] = useState<
    { error: Error | undefined; id: string; preferredName: string }[]
  >([])

  useEffect(() => {
    let mounted = true

    const fetchPreferredName = async (id: string) => {
      const url = urlJoin(discoveryEndpoint, '/authority-files/', id ?? '')
      try {
        const res = await fetch(url)
        const fetchedJson = await res.json()
        return {
          id,
          preferredName: fetchedJson.preferredName || id,
          error: undefined,
        }
      } catch (error) {
        return {
          id,
          preferredName: id,
          error: error as Error,
        }
      }
    }

    const fetchAllNames = async () => {
      const results = await Promise.all(ids.map(fetchPreferredName))
      if (mounted) {
        setResults(results)
      }
    }

    fetchAllNames()

    return () => {
      mounted = false
    }
  }, [])

  return { results }
}
