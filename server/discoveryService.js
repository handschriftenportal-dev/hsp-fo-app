const { URL } = require('url')
const { Eureka } = require('eureka-js-client')
const urlJoin = require('proper-url-join')
const fetch = require('isomorphic-unfetch')

const logger = require('./utils/logger')

/************************************************
 * Assemble config from environment variables
 ***********************************************/

const discoveryServiceName = process.env.DISCOVERY_SERVICE_NAME
const eurekaAppsEndpoint = process.env.EUREKA_APPS_ENDPOINT

/************************************************
 * Eureka client setup
 ***********************************************/

const eurekaAppsUrl = new URL(eurekaAppsEndpoint)

const eureka = new Eureka({
  eureka: {
    host: eurekaAppsUrl.hostname,
    port: eurekaAppsUrl.port,
    servicePath: eurekaAppsUrl.pathname,
    registerWithEureka: false,
  },
})

// returns string or undefined
const getDiscoveryServiceEndpoint = () => {
  const instance = eureka.getInstancesByAppId(discoveryServiceName)[0]

  if (!instance || !instance.homePageUrl) {
    logger('error', 'could not get address of discovery service from eureka')
    return undefined
  }
  if (instance) {
    logger('info', 'status of discovery service: ' + instance.status)
  }
  return urlJoin(instance.homePageUrl, 'api')
}

async function getDiscoveryInfos() {
  const infos = await fetch(urlJoin(getDiscoveryServiceEndpoint() + '/info'))
  return infos.json()
}

async function getDiscoveryEntries() {
  const infos = await getDiscoveryInfos()

  const kodResponse = await fetch(
    urlJoin(
      getDiscoveryServiceEndpoint() +
        '/kods?fields=id,last-modified&start=0&rows=' +
        infos.items['hsp:object'],
    ),
  )

  const descResponse = await fetch(
    urlJoin(
      getDiscoveryServiceEndpoint() +
        '/descriptions?fields=id,last-modified&start=0&rows=' +
        infos.items['hsp:description'],
    ),
  )
  const kodRes = await kodResponse.json()
  const descRes = await descResponse.json()

  return [...(kodRes.payload ?? []), ...(descRes.payload ?? [])]
}

module.exports = {
  eureka,
  getDiscoveryServiceEndpoint,
  getDiscoveryInfos,
  getDiscoveryEntries,
}
