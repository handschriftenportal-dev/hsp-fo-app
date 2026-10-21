const fetch = require('isomorphic-fetch')
const { ProxyAgent } = require('proxy-agent')

const proxyAgent = new ProxyAgent()

function fetchWithProxy(url) {
  return fetch(url, { agent: proxyAgent })
}

module.exports = fetchWithProxy
