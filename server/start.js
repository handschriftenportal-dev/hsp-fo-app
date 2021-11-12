/*
 * MIT License
 *
 * Copyright (c) 2021 Staatsbibliothek zu Berlin - Preußischer Kulturbesitz
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

const path = require('path')
const express = require('express')
const httpProxy = require('http-proxy')
const compression = require('compression')
const packageJson = require('../package.json')

const host = process.env.APP_HOST
const port = parseInt(process.env.APP_PORT)
const discoveryServiceEndpoint = process.env.DISCOVERY_SERVICE_ENDPOINT
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
}

const root = path.join(__dirname, '../dist')

const logger = (type, message) => {
  const date = new Date().toUTCString()
  const _message = message.replace(/\n/g, ' ')
  console.log(`${date}: ${type}: ${_message}`)
}

const handleProxyError = (sourceUrl, targetUrl, targetHost, res) => err => {
  const msgToServer = `failed to redirect ${sourceUrl} to ${targetHost}${targetUrl}: ${err.message}`
  const msgToBrowser = `failed to redirect ${sourceUrl}`
  logger('error', msgToServer)
  res.writeHead(500, { 'Content-Type': 'text/plain' })
  res.end(msgToBrowser)
}

const app = express()
const proxy = httpProxy.createProxyServer({
  followRedirects: true,
})

// Tell express that it receives requests from a forward proxy.
// If the proxy supports the X-Forwarded-* header then express
// will retrieve the client ip from this header field. Otherwise
// express will use the proxy's IP when refering to `req.ip`.
// (see: https://expressjs.com/en/guide/behind-proxies.html)
app.set('trust proxy', true)

app.use(compression())

// Log every request
app.use(function(req, res, next) {
  logger('info', `${req.method} ${req.url} (${req.ip})`)
  next()
})

// Serve static files from `root`. The URL path of a request
// is taken as a directory path starting at `root`. If a file
// could not be found it calls the next router middleware.
//
// That means if a file could not be found we won't see a
// error message in the browser: this is intentional for
// security reasons.
app.use(express.static(root))

app.get('/api/health', function(req, res) {
  res.json({
    status: "I'm fine.",
    version: packageJson.version,
  })
})

app.get('/api/tracking', function(req, res) {
  res.json(trackingConfig)
})

app.get('/api/features', function(req, res) {
  res.json(featureFlags)
})

app.get([
  '/api/search/hspobjects',
  '/api/search/hspobjects/*',
  '/api/search/tei/*'
], function(req, res) {
  const sourceUrl = req.url
  req.url = req.url.replace('/api/search', '')
  proxy.web(req, res, {
    target: discoveryServiceEndpoint,
    changeOrigin: true
  }, handleProxyError(sourceUrl, req.url, discoveryServiceEndpoint, res))
})

app.get([
  '/api/wordpress/wp-json/*',
  '/api/wordpress/en/wp-json/*',
  '/api/wordpress/wp-content/*',
  '/api/wordpress/css'
], function(req, res) {
  const sourceUrl = req.url
  // only one of the following two replacements will be performed
  req.url = req.url.replace('/api/wordpress/css', wordpressCssPath)
  req.url = req.url.replace('/api/wordpress', '')
  proxy.web(req, res, {
    target: wordpressEndpoint,
    changeOrigin: true
  }, handleProxyError(sourceUrl, req.url, wordpressEndpoint, res))
})

app.get('/*', function(req, res) {
  res.sendFile(path.join(root, 'index.html'))
})

app.listen(port, host, function() {
  logger('info', `server listening on ${host}:${port} ...`)
  logger('info', `redirect /api/search to ${discoveryServiceEndpoint}`)
  logger('info', `redirect /api/wordpress to ${wordpressEndpoint}`)
})
