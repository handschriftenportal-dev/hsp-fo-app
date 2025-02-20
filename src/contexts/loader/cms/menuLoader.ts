import urlJoin from 'proper-url-join'
import { QueryClient } from 'react-query'
import WPAPI from 'wpapi'

import {
  MenuProps,
  WordpressMenuItem,
  wordpressEndpoint,
} from 'src/contexts/wordpress'
import { getSlug } from 'src/utils'

interface WordpressMenu {
  taxonomy: string
  items: WordpressMenuItem[]
}

// fetches Menu for given language
export function fetchWordpressMenus(
  wordpressEndpoint: string,
  lang: string,
): Promise<WordpressMenu> {
  const wp = new WPAPI({
    endpoint: urlJoin(wordpressEndpoint, '/wp-json'),
  })

  wp.menuLocation = wp.registerRoute('menus/v1', '/menus/(?P<lang>)')

  return wp
    .menuLocation()
    .lang('menu-' + lang)
    .get()
}

function wordpressMenuToItem(wpMenu: WordpressMenuItem): any {
  const slug = getSlug(new URL(wpMenu.url).pathname)
  const url = new URL(urlJoin('/info', '/' + slug), window.location.origin)
  url.search = ''
  url.hash = ''
  return {
    id: wpMenu.ID.toString(),
    label: wpMenu.title,
    children: wpMenu.child_items?.map(wordpressMenuToItem) || [],
    link: url.href,
  }
}

async function fetchMenusWithLanguage(language: string) {
  try {
    const menus = await fetchWordpressMenus(wordpressEndpoint, language)
    return menus.items.map(wordpressMenuToItem)
  } catch (error) {
    return { error }
  }
}

const menuQuery = (lang: string) => ({
  queryKey: ['menu', lang],
  queryFn: async () => fetchMenusWithLanguage(lang),
})

export const menuLoader = (queryClient: QueryClient) => async () => {
  const languages = ['de', 'en']

  const menuPromises = languages.map(async (language) => {
    const query = menuQuery(language)
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    )
  })

  const [menusDe, menusEn] = await Promise.all(menuPromises)

  return {
    ...((menusDe as MenuProps).error ? {} : { de: menusDe }),
    ...((menusEn as MenuProps).error ? {} : { en: menusEn }),
  }
}
