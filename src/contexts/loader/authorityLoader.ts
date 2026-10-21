import { QueryClient } from '@tanstack/react-query'
import urlJoin from 'proper-url-join'

import { AuthItemProps, discoveryEndpoint, fetchJson } from '../discovery/'
import { fetchHspObjectsQuery } from './searchLoader'
import { streamed } from './streamed'

export interface AuthorityDataProps {
  authItem: AuthItemProps
  numFound: number
}

export interface AuthorityFileLoaderProps {
  authorityData: Promise<AuthorityDataProps>
}

async function fetchNormObjectQuery(
  id: string | null,
  queryClient: QueryClient,
) {
  const normEndpoint = urlJoin(discoveryEndpoint, '/authority-files/', id ?? '')

  const queryKeyNorm = ['authorityFileById', id]
  const queryFnNorm = () => fetchJson(fetch, normEndpoint)

  return (
    queryClient.getQueryData(queryKeyNorm) ??
    (await queryClient.fetchQuery({
      queryKey: queryKeyNorm,
      queryFn: queryFnNorm,
    }))
  )
}

/**
 * Fetches a authItem and the numFound for it by its id.
 */
export const normLoader =
  (queryClient: QueryClient) =>
  async ({ request }: { request: Request }) => {
    const authorityfileid = new URL(request.url).searchParams.get(
      'authorityfileid',
    )

    const params = {
      q: `"${authorityfileid}"`,
      fq: undefined,
      start: undefined,
      rows: 0,
      qf: ['authority-file-facet'],
    }

    const numFoundPromise = fetchHspObjectsQuery(params, queryClient).then(
      (hspObjects) => {
        return hspObjects.metadata.numFound ?? 0
      },
    )
    const authItemPromise = fetchNormObjectQuery(authorityfileid, queryClient)

    return {
      authorityData: streamed(
        Promise.all([authItemPromise, numFoundPromise]).then(
          ([authItem, numFound]) => ({
            authItem,
            numFound,
          }),
        ),
      ),
    }
  }
