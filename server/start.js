const path = require('path')
const express = require('express')
const urlJoin = require('proper-url-join')
const compression = require('compression')
const { eureka, getDiscoveryServiceEndpoint } = require('./discoveryService')
const { i18nextMiddleware, i18next } = require('./middleware/i18n')
const { sitemapScheme } = require('./middleware/sitemaps.js')
const logger = require('./utils/logger')

/************************************************
 * Assemble config from environment variables
 ***********************************************/

const host = process.env.APP_HOST
const port = parseInt(process.env.APP_PORT)
const wordpressEndpoint = process.env.WORDPRESS_ENDPOINT

/************************************************
 * Express setup
 ***********************************************/

const root = path.join(__dirname, '../dist')

async function fetchHspBaseEntities(id) {
  const response = await fetch(`${getDiscoveryServiceEndpoint()}/any/${id}`)
  return response.json()
}
;(async () => {
  await i18next

  const app = express()

  // Tell express that it receives requests from a forward proxy.
  // If the proxy supports the X-Forwarded-* header then express
  // will retrieve the client ip from this header field. Otherwise
  // express will use the proxy's IP when refering to `req.ip`.
  // (see: https://expressjs.com/en/guide/behind-proxies.html)
  app.set('trust proxy', true)

  // to use ejs template engine from the bundled webpack file in /dist/index.ejs
  // in dev & production the file is in the same location
  app.set('view engine', 'ejs')
  app.set('views', './dist')

  app.use(compression())

  app.get('/', (req, res, next) => {
    const id = req.query.id
    if (!id) {
      next()
    } else {
      fetchHspBaseEntities(id)
        .then(({ type }) => {
          let url
          switch (type) {
            case 'hsp:object':
              url = `/search?hspobjectid=${id}`
              break
            case 'hsp:authority-file':
              url = `/authority-files?authorityfileid=${id}`
              break
            default:
              url = `/workspace?type=${type}&id=${id}`
              break
          }
          delete req.query.id
          res.redirect(urlJoin(encodeURI(url), { query: req.query }))
        })
        .catch((error) => {
          logger('error', `direct link failed: ${error}`)
          res.redirect(`/search?q=${id}`)
        })
    }
  })

  // Log every request
  app.use(function (req, _res, next) {
    logger('info', `${req.method} ${req.url} (${req.ip})`)
    next()
  })

  app.use(
    i18nextMiddleware.handle(i18next, {
      ignoreRoutes: function (req) {
        const isTemplateRoutes =
          req.path === '/' ||
          /\/search(.*)|\/info(.*)|\/projects(.*)|\/workspace(.*)|\/authority-files(.*)/.test(
            req.path,
          )
        const isSitemapsRoute = sitemapScheme.test(req.path)
        return !isTemplateRoutes && !isSitemapsRoute
      },
    }),
  )

  // Serve static files from `root`. The URL path of a request
  // is taken as a directory path starting at `root`. If a file
  // could not be found it calls the next router middleware.
  //
  // That means if a file could not be found we won't see a
  // error message in the browser: this is intentional for
  // security reasons.
  app.use(express.static(root))

  /************************************************
   * Express request routes
   ***********************************************/
  const healthRoutes = require('./routes/health')
  const trackingRoutes = require('./routes/tracking.js')
  const featureFlagRoutes = require('./routes/feature.js')
  const searchRoutes = require('./routes/search.js')
  const cmsRoutes = require('./routes/wordpress.js')
  const sitemapRoutes = require('./routes/sitemaps.js')
  const templateRoutes = require('./routes/template.js')
  const keycloakRoutes = require('./routes/keycloak.js')

  app.use(healthRoutes)
  app.use(trackingRoutes)
  app.use(featureFlagRoutes)
  app.use(searchRoutes)
  app.use(cmsRoutes)
  app.use(sitemapRoutes)
  app.use(templateRoutes)
  app.use(keycloakRoutes)

  app.get('*', (_req, res) => {
    res.redirect(301, '/')
  })

  /************************************************
   * Start
   ***********************************************/

  logger('info', 'waiting for eureka client ...')

  eureka.start((err) => {
    if (err) {
      logger('error', `eureka client failed: ${err.message}`)
    }

    app.listen(port, host, function () {
      logger('info', `server listening on ${host}:${port} ...`)
      logger('info', `redirect /api/search to ${getDiscoveryServiceEndpoint()}`)
      logger('info', `redirect /api/wordpress to ${wordpressEndpoint}`)
    })
  })
})()
