import { QueryClient } from 'react-query'
import { LoaderFunctionArgs } from 'react-router-dom'
import urlJoin from 'url-join'
import WPAPI from 'wpapi'

import { i18n } from '../../i18n'
import { WordpressPage, wordpressEndpoint } from '../../wordpress'

export interface CMSLoaderDataProps {
  page: [WordpressPage]
}

function fetchWordpressPageWithSlugs(
  wordpressEndpoint: string,
  slug: string,
  lang: string,
): Promise<WordpressPage[]> {
  const wp = new WPAPI({
    endpoint: urlJoin(wordpressEndpoint, 'wp-json'),
  })

  // get page according to i18n lang and slug
  return wp.pages().slug(slug).param('lang', lang).get()
}

export async function fetchCms(
  slug: string,
  lang: string,
  queryClient: QueryClient,
) {
  const queryKeyCmsPage = ['cms', slug, lang]
  const queryFnCmsPage = () =>
    fetchWordpressPageWithSlugs(wordpressEndpoint, slug, lang)

  return (
    queryClient.getQueryData(queryKeyCmsPage) ??
    (await queryClient.fetchQuery(queryKeyCmsPage, queryFnCmsPage))
  )
}

export const cmsLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const { slug } = params
    const lang = i18n.language
    if (!slug) {
      const statusText = 'Slug is missing'
      throw new Response(statusText, {
        statusText,
        status: 400,
      })
    }

    const page = await fetchCms(slug, lang, queryClient)

    if (!Array.isArray(page) || page.length === 0) {
      const statusText = 'CMS page not found'
      throw new Response(statusText, {
        statusText,
        status: 404,
      })
    }

    return { page }
  }
