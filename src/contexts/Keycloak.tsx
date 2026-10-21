import Keycloak from 'keycloak-js'
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

async function loadKeycloakConfig() {
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
    console.error('Error loading Keycloak configuration:', error)
    throw error
  }
}

export interface KeycloakContextValue {
  keycloak: Keycloak
  initialized: boolean
}

// Consumers are gated by `featureFlags.annotation`, matching the gate that
// wraps the tree with KeycloakProvider. The default keycloak is never read.
const KeycloakContext = createContext<KeycloakContextValue>({
  keycloak: undefined as unknown as Keycloak,
  initialized: false,
})

export interface KeycloakProviderProps {
  authClient: Keycloak
  children: React.ReactNode
}

export function KeycloakProvider({
  authClient,
  children,
}: KeycloakProviderProps) {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    let cancelled = false
    authClient
      .init({})
      .then(() => {
        if (!cancelled) {
          setInitialized(true)
        }
      })
      .catch((error) => {
        console.error('Keycloak init failed:', error)
      })
    return () => {
      cancelled = true
    }
  }, [authClient])

  const value = useMemo<KeycloakContextValue>(
    () => ({ keycloak: authClient, initialized }),
    [authClient, initialized],
  )

  return (
    <KeycloakContext.Provider value={value}>
      {children}
    </KeycloakContext.Provider>
  )
}

export function useKeycloak(): KeycloakContextValue {
  return useContext(KeycloakContext)
}

export default loadKeycloakConfig
