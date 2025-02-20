const { responseInterceptor } = require('http-proxy-middleware')
const logger = require('../utils/logger')

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
}

// If the proxy request fails, send a generic error message to the client.
// And log a server side error message.
const discoveryProxyOptions = {
  onError: (_err, _req, res) => {
    logger(
      'error',
      `proxy failed to make a request to the discovery service: ${_err.message}`,
    )
    if (res) {
      res.writeHead(500, { 'Content-Type': 'text/plain' }).end('Request failed')
    }
  },
}
const wordpressProxyOptions = {
  onError: (_err, _req, res) => {
    logger(
      'error',
      `proxy failed to make a request to wordpress: ${_err.message}`,
    )
    res.writeHead(500, { 'Content-Type': 'text/plain' }).end('Request failed')
  },
}

module.exports = {
  commonProxyOptions,
  discoveryProxyOptions,
  wordpressProxyOptions,
}
