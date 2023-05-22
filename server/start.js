const path = require('path')
const express = require('express')
const nocache = require('nocache')
const urlJoin = require('proper-url-join')
const {
  createProxyMiddleware,
  responseInterceptor,
} = require('http-proxy-middleware')
const compression = require('compression')

const { eureka, getDiscoveryServiceEndpoint } = require('./discoveryService')
const generateTemplateData = require('./template-data')
const { i18nextMiddleware, i18next } = require('./middleware/i18n')
const { sitemapScheme, getSitemaps } = require('./middleware/sitemaps.js')
const logger = require('./utils/logger')

/************************************************
 * Assemble config from environment variables
 ***********************************************/

const host = process.env.APP_HOST
const port = parseInt(process.env.APP_PORT)
const wordpressEndpoint = process.env.WORDPRESS_ENDPOINT
const wordpressCssPath = process.env.WORDPRESS_CSS_PATH

const trackingConfig = {
  activate: process.env.TRACKING_ACTIVATE === 'true',
  matomoBaseUrl: process.env.TRACKING_MATOMO_BASE_URL || '',
  matomoSiteId: parseInt(process.env.TRACKING_MATOMO_SITE_ID) || 0,
  clientMockOrigin: process.env.TRACKING_CLIENT_MOCK_ORIGIN,
}

const featureFlags = {
  cms: process.env.FEATURE_CMS === 'true',
  retroDescDisplay: process.env.FEATURE_RETRO_DESC_DISPLAY === 'true',
}

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
    }

    fetchHspBaseEntities(id)
      .then(({ type }) => {
        const url =
          type === 'hsp:object'
            ? `/search?hspobjectid=${id}`
            : `/workspace?type=${type}&amp;id=${id}`
        delete req.query.id
        res.redirect(urlJoin(url, { query: req.query }))
      })
      .catch((error) => {
        logger('error', `direct link failed: ${error}`)
      })
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
          /\/search(.*)|\/info(.*)|\/projects(.*)|\/workspace(.*)/.test(
            req.path
          )
        const isSitemapsRoute = sitemapScheme.test(req.path)
        return !isTemplateRoutes && !isSitemapsRoute
      },
    })
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
   * Proxy setup
   ***********************************************/

  const commonProxyOptions = {
    followRedirects: true,
    changeOrigin: true,
    selfHandleResponse: true,

    // If the target response status is not 2xx then change the original
    // response body with a generic error message. The reason is to prevent
    // credentials of the original reponse to show up in the browser
    // (e.g. IP address of the backend service).
    onProxyRes: responseInterceptor(async (buffer, _proxyRes, _req, res) => {
      return res.statusCode < 200 || res.statusCode > 299
        ? 'Request failed.'
        : buffer
    }),

    // If the proxy request fails send an generic error message to the client.
    // The proxy will log a server side error message so we don't need to.
    onError: (_err, _req, res) => {
      // eslint-disable-line node/handle-callback-err
      res
        .writeHead(500, { 'Content-Type': 'text/plain' })
        .end('Request failed.')
    },
  }

  /************************************************
   * Express request handlers
   ***********************************************/

  app.get('/api/health', function (_req, res) {
    const packageJson = require('../package.json')
    res.json({
      status: "I'm fine.",
      version: packageJson.version,
    })
  })

  app.get('/api/tracking', function (_req, res) {
    res.json(trackingConfig)
  })

  app.get('/api/features', function (_req, res) {
    res.json(featureFlags)
  })

  app.get(
    ['/api/search/hspobjects', '/api/search/hspobjects/*', '/api/search/tei/*'],
    createProxyMiddleware({
      ...commonProxyOptions,
      router: () => getDiscoveryServiceEndpoint(),
      pathRewrite: { '/api/search': '' },
    })
  )

  // If this endpoint receives an url that points to
  // the backend wordpress instance than redirect the request
  // to the wordpress api endpoint of this application (see below).
  // Otherwise it "redirects" to the original url that was passed.
  app.get('/api/wordpress/resolve', function (req, res) {
    const originalUrl = req.query.originalUrl || '/'
    res.redirect(originalUrl.replace(wordpressEndpoint, '/api/wordpress'))
  })

  app.get(
    [
      '/api/wordpress/wp-json/*',
      '/api/wordpress/en/wp-json/*',
      '/api/wordpress/wp-content/*',
      '/api/wordpress/css',
    ],
    createProxyMiddleware({
      ...commonProxyOptions,
      target: wordpressEndpoint,
      pathRewrite: {
        '^/api/wordpress/css': wordpressCssPath,
        '/api/wordpress': '',
      },
    })
  )

  app.get('/robots.txt', function (req, res) {
    res.type('text/plain')
    const fullUrl = req.protocol + '://' + req.get('host')
    res.send(`User-agent: *
  Sitemap: ${fullUrl}/sitemap.xml
  `)
  })

  const indexHtmlPaths = [
    '/',
    '/search*',
    '/info*',
    '/projects*',
    '/workspace*',
  ]

  app.use(indexHtmlPaths, nocache())

  app.get(indexHtmlPaths, async (req, res) => {
    const templateData = await generateTemplateData(req)
    res.render('index', templateData)
  })

  // uncomment if you want to serve sitemaps
  app.get(sitemapScheme, getSitemaps)

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
      process.exit(-1)
    }

    // The function logs an server side error message
    // if it could not get the endpoint, so we don't need to.
    if (!getDiscoveryServiceEndpoint()) {
      process.exit(-1)
    }

    app.listen(port, host, function () {
      logger('info', `server listening on ${host}:${port} ...`)
      logger('info', `redirect /api/search to ${getDiscoveryServiceEndpoint()}`)
      logger('info', `redirect /api/wordpress to ${wordpressEndpoint}`)
    })
  })
})()
