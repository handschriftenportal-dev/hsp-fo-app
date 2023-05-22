const WPAPI = require('wpapi')
const urlJoin = require('proper-url-join')

const wordpressEndpoint = process.env.WORDPRESS_ENDPOINT
const wp = new WPAPI({
  endpoint: urlJoin(wordpressEndpoint, '/wp-json'),
})

/**
 * Returns the last part of an url pathname or undefined.
 */
function getSlug(path) {
  return path
    .split('/')
    .filter((x) => x)
    .reverse()[0]
}

async function getPageBySlug(req) {
  const slug = getSlug(req.url)

  // get page according to i18n lang and slug
  return wp.pages().slug(slug).param('lang', req.i18n.language).get()
}

async function getProjectPages() {
  // get pages according to parent id
  function getAcfPages(id) {
    return wp.pages().param('parent', id).param('per_page', 100).get()
  }

  const parentPage = await wp.pages().slug('projekte')
  const pages = await getAcfPages(parentPage[0].id) // get pages with id
  const projectsPages = pages.map(({ acf }) => acf) // extract acf information
  return projectsPages
}

async function getInfoSlugs(req) {
  wp.menuLocation = wp.registerRoute('menus/v1', '/menus/(?P<lang>)')
  const cmsPages = await wp
    .menuLocation()
    .lang('menu-' + req.i18n.language)
    .get()
    .then((menus) => menus.items)

  const slugs = []
  cmsPages.forEach((menuEntry) => slugs.push(menuEntry.slug))
  cmsPages
    .map((children) => children.child_items)
    .flat()
    .filter((slug) => slug)
    .forEach((elem) => slugs.push(elem.slug))

  return slugs
}

module.exports = { getInfoSlugs, getProjectPages, getPageBySlug }
