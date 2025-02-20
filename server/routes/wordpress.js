const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const {
  commonProxyOptions,
  wordpressProxyOptions,
} = require('../config/proxySetup')
const wordpressEndpoint = process.env.WORDPRESS_ENDPOINT
const wordpressCssPath = process.env.WORDPRESS_CSS_PATH

const router = express.Router()

// If this endpoint receives an url that points to
// the backend wordpress instance than redirect the request
// to the wordpress api endpoint of this application (see below).
// Otherwise it "redirects" to the original url that was passed.
router.get('/api/wordpress/resolve', function (req, res) {
  const originalUrl = req.query.originalUrl || '/'
  res.redirect(originalUrl.replace(wordpressEndpoint, '/api/wordpress'))
})

router.get(
  [
    '/api/wordpress/wp-json/*',
    '/api/wordpress/en/wp-json/*',
    '/api/wordpress/wp-content/*',
    '/api/wordpress/css',
  ],
  createProxyMiddleware({
    ...{ ...commonProxyOptions, ...wordpressProxyOptions },
    target: wordpressEndpoint,
    pathRewrite: {
      '^/api/wordpress/css': wordpressCssPath,
      '/api/wordpress': '',
    },
  }),
)

module.exports = router
