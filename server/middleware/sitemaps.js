const xml = require('xml')
const Nodecache = require('node-cache')
const { getDiscoveryEntries } = require('../discoveryService')
const { getInfoSlugs, getProjectPages } = require('../utils/wordpress')

const ttl = 60 * 60 * 24 * 1000 // 24 h
const sitemapScheme = /\/sitemap(\d+)?\.xml/
const siteMapCache = new Nodecache({ stdTTL: ttl })
const siteMapSize = 20000

function buildSitemapCms(baseUrl, infoEntries, projectEntries) {
  const xmlObject = {
    urlset: [
      {
        _attr: {
          xmlns: 'http://www.sitemaps.org/schema/sitemap/0.9',
        },
      },
      { url: [{ loc: baseUrl }] },
      ...infoEntries.map((slug) => {
        return {
          url: [{ loc: baseUrl + '/info/' + slug }],
        }
      }),
      ...projectEntries.map((id) => {
        return {
          url: [{ loc: baseUrl + '/projects?projectid=' + id }],
        }
      }),
    ],
  }
  return xml(xmlObject)
}

function buildSitemapDiscovery(discoveryEntries, baseUrl) {
  const xmlObject = {
    urlset: [
      {
        _attr: {
          xmlns: 'http://www.sitemaps.org/schema/sitemap/0.9',
        },
      },
      ...discoveryEntries.map((entry) => {
        return {
          url: [
            { loc: baseUrl + '?id=' + entry.id },
            { lastmod: entry['last-modified'] },
          ],
        }
      }),
    ],
  }
  return xml(xmlObject)
}

function buildIndexSitemap(sitemaps, baseUrl) {
  const siteMapKeys = Object.keys(sitemaps)
  const xmlObject = {
    sitemapindex: [
      {
        _attr: {
          xmlns: 'http://www.sitemaps.org/schema/sitemap/0.9',
        },
      },
      ...siteMapKeys.map((sitemapUrl) => {
        return {
          url: [{ loc: baseUrl + sitemapUrl }],
        }
      }),
    ],
  }
  return xml(xmlObject)
}

async function buildSitemaps(
  baseUrl,
  discoveryEntries,
  sitemapSize,
  infoEntries,
  projectEntries
) {
  const sitemaps = {}

  sitemaps['/sitemap1.xml'] = buildSitemapCms(
    baseUrl,
    infoEntries,
    projectEntries
  )

  for (let i = 1; (i - 1) * sitemapSize < discoveryEntries.length; i++) {
    const start = (i - 1) * sitemapSize
    const selectedUrls = discoveryEntries.slice(start, start + sitemapSize)
    sitemaps[`/sitemap${i + 1}.xml`] = buildSitemapDiscovery(
      selectedUrls,
      baseUrl
    )
  }
  sitemaps['/sitemap.xml'] = buildIndexSitemap(sitemaps, baseUrl)

  return sitemaps
}

const getSitemaps = async (req, res, next) => {
  if (siteMapCache.has('sitemaps')) {
    const sitemaps = siteMapCache.get('sitemaps')
    if (sitemaps[req.url]) {
      res.setHeader('Content-Type', 'application/xml')
      return res.status(200).send(sitemaps[req.url])
    } else {
      next()
    }
  } else {
    let projectEntries = []
    let infoEntries = []
    try {
      const entries = (await getProjectPages()).map(({ id }) => id)
      projectEntries = projectEntries.concat(entries)
    } catch (err) {
      console.error(err)
    }
    try {
      const infos = await getInfoSlugs(req)
      infoEntries = infoEntries.concat(infos)
    } catch (err) {
      console.error(err)
    }

    const discoveryEntries = await getDiscoveryEntries()
    const appPort = process.env.APP_PORT
    const port = [80, 443, undefined].includes(appPort) ? '' : ':' + appPort
    const baseUrl = `${req.protocol}://${req.hostname}${port}`
    const sitemaps = await buildSitemaps(
      baseUrl,
      discoveryEntries,
      siteMapSize,
      infoEntries,
      projectEntries
    )

    siteMapCache.set('sitemaps', sitemaps)
    if (sitemaps[req.url]) {
      res.setHeader('Content-Type', 'application/xml')
      return res.status(200).send(sitemaps[req.url])
    } else {
      next()
    }
  }
}

module.exports = { sitemapScheme, getSitemaps }
