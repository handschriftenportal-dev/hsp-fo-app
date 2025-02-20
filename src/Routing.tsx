import { ReactKeycloakProvider } from '@react-keycloak/web'
import Keycloak from 'keycloak-js'
import React, { useEffect, useState } from 'react'

import { useFeatureFlags } from 'src/contexts/features'
import { Router } from 'src/contexts/router'

import initializeKeycloak from './contexts/Keycloak'

export const Routing: React.FC = () => {
  const featureFlags = useFeatureFlags()
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null)
  const [keycloakInitialized, setKeycloakInitialized] = useState(false)

  useEffect(() => {
    if (featureFlags.annotation) {
      initializeKeycloak()
        .then((kc) => {
          setKeycloak(kc)
          setKeycloakInitialized(true)
        })
        .catch((error) => {
          console.error('Failed to initialize Keycloak:', error)
        })
    }
  }, [featureFlags.annotation])

  if (featureFlags.annotation && !keycloakInitialized) {
    return <></>
  }

  return featureFlags.annotation && keycloak ? (
    <ReactKeycloakProvider authClient={keycloak}>
      <Router hasKeycloak={true} />
    </ReactKeycloakProvider>
  ) : (
    <Router hasKeycloak={false} />
  )
}
