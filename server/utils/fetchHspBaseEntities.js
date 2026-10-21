const { getDiscoveryServiceEndpoint } = require('./discoveryService')

async function fetchHspBaseEntities(id) {
  const response = await fetch(`${getDiscoveryServiceEndpoint()}/any/${id}`)
  return response.json()
}

module.exports(fetchHspBaseEntities)
