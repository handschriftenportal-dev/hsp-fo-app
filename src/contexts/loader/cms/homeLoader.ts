import urlJoin from 'proper-url-join'
import { QueryClient } from 'react-query'
import WPAPI from 'wpapi'

import { ImageSet, wordpressEndpoint } from 'src/contexts/wordpress'

export type HomeLoaderDataProps = {
  imageSets?: ImageSet[]
  error?: Record<string, unknown>
}

function getImageSetsFromAcf(acf: Record<string, string>): ImageSet[] {
  const imageSetsFromAcf = []
  let i = 1
  let imageKey = `image_${i}`
  while (imageKey in acf && typeof acf[imageKey] === 'string') {
    imageSetsFromAcf.push({
      url: acf[imageKey],
      ident: acf[`${imageKey}_ident`],
      info: acf[`${imageKey}_info`],
    })
    i++
    imageKey = `image_${i}`
  }
  return imageSetsFromAcf
}

function replaceImageUrls(sets: ImageSet[]) {
  return sets.map((set) => ({
    ...set,
    url: urlJoin(
      wordpressEndpoint,
      'wp-content',
      set.url.replace(/^.*\/wp-content\//, ''),
    ),
  }))
}

export async function fetchHome(queryClient: QueryClient) {
  const wp = new WPAPI({
    endpoint: urlJoin(wordpressEndpoint, '/wp-json'),
  })

  const queryKeyHome = ['home']
  const queryFnHome = () => wp.pages().slug('startseite')

  return (
    queryClient.getQueryData(queryKeyHome) ??
    (await queryClient.fetchQuery(queryKeyHome, queryFnHome))
  )
}

export const homeLoader = (queryClient: QueryClient) => async () => {
  try {
    const pages = await fetchHome(queryClient)
    const acf = pages[0].acf
    const sets = getImageSetsFromAcf(acf)
    const replacedSets = replaceImageUrls(sets)

    return { imageSets: replacedSets, error: undefined }
  } catch (error: unknown) {
    return { imageSets: undefined, error }
  }
}
