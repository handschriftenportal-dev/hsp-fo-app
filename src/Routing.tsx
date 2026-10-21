import Keycloak from 'keycloak-js'
import React, { useEffect, useState } from 'react'

import { useFeatureFlags } from 'src/contexts/features'
import { Router } from 'src/contexts/router'

import loadKeycloakConfig, { KeycloakProvider } from './contexts/Keycloak'

export const Routing: React.FC = () => {
  const featureFlags = useFeatureFlags()
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null)
  const [keycloakInitialized, setKeycloakInitialized] = useState(false)

  useEffect(() => {
    if (featureFlags.annotation) {
      loadKeycloakConfig()
        .then((kc) => {
          setKeycloak(kc)
          setKeycloakInitialized(true)
        })
        .catch((error) => {
          console.error('Failed to load Keycloak configuration:', error)
        })
    }
  }, [featureFlags.annotation])

  if (featureFlags.annotation && !keycloakInitialized) {
    return <></>
  }

  return featureFlags.annotation && keycloak ? (
    <KeycloakProvider authClient={keycloak}>
      <Router hasKeycloak={true} />
    </KeycloakProvider>
  ) : (
    <Router hasKeycloak={false} />
  )
}
