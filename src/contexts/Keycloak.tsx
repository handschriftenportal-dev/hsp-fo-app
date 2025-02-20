import Keycloak from 'keycloak-js'

async function initializeKeycloak() {
  try {
    const response = await fetch('/api/keycloak')
    if (!response.ok) {
      throw new Error(
        `Failed to fetch Keycloak configuration: ${response.statusText}`,
      )
    }

    const config = await response.json()
    const keycloak = new Keycloak({
      url: config.url,
      realm: config.realm,
      clientId: config.clientId,
    })

    return keycloak
  } catch (error) {
    console.error('Error initializing Keycloak:', error)
    throw error
  }
}

export default initializeKeycloak
