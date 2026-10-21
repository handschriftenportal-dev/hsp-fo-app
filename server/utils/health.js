const { eureka } = require('../discoveryService')

const discoveryServiceName = process.env.DISCOVERY_SERVICE_NAME

const serviceHealth = {
  discovery: '',
  wordpress: '',
}

async function getWordpressHealth(req) {
  const port = req.header('Host').includes('8080') ? ':8080' : ''
  const baseUrl = `${req.protocol}://${req.hostname}${port}`
  const result = await fetch(baseUrl + '/api/wordpress/wp-content/')
  return result
}

async function getServicesHealth(req) {
  const instance = eureka.getInstancesByAppId(discoveryServiceName)[0]
  if (!instance) {
    serviceHealth.discovery = 'undefined'
  } else {
    serviceHealth.discovery = instance.status
  }
  serviceHealth.wordpress = await getWordpressHealth(req).then(function (res) {
    return res.status
  })

  return serviceHealth
}

module.exports = {
  getServicesHealth,
}
