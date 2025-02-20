const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const { getDiscoveryServiceEndpoint } = require('../discoveryService')
const {
  commonProxyOptions,
  discoveryProxyOptions,
} = require('../config/proxySetup')

const router = express.Router()

router.get(
  [
    '/api/authority-files/*',
    '/api/catalogs',
    '/api/catalogs/*',
    '/api/digitizeds/search*',
    '/api/hspobjects',
    '/api/hspobjects/*',
    '/api/info/fields',
    '/api/kods/*',
    '/api/tei/*',
  ],
  createProxyMiddleware({
    ...{ ...commonProxyOptions, ...discoveryProxyOptions },
    router: () => getDiscoveryServiceEndpoint(),
    pathRewrite: { '/api/': '' },
  }),
)

// TODO: Remove when it is possible to get xml from /api/tei/:id .
router.get(
  ['/api/search/tei/*'],
  createProxyMiddleware({
    ...{ ...commonProxyOptions, ...discoveryProxyOptions },
    router: () => getDiscoveryServiceEndpoint(),
    pathRewrite: { '/api/search/': '' },
  }),
)

module.exports = router
