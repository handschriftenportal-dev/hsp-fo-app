import { useKeycloak } from '@react-keycloak/web'
import React, { useEffect, useRef } from 'react'

import { useTheme } from '@material-ui/core/styles'

import { useModules, useSetupModulesForPage } from 'src/contexts/modules'
import { useTrackPageView } from 'src/contexts/tracking'

export function Workspace({ hasKeycloak }: { hasKeycloak?: boolean }) {
  const modules = useModules()
  const theme = useTheme()

  const keycloak = hasKeycloak ? useKeycloak().keycloak : null
  const mainContainer = useRef(document.createElement('div'))
  mainContainer.current.style.height = `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`
  mainContainer.current.style.position = 'relative'
  mainContainer.current.style.zIndex = '1200'
  const divRef = useRef<HTMLDivElement>(null)

  useSetupModulesForPage()
  useTrackPageView('Workspace')

  useEffect(() => {
    if (divRef.current) {
      modules.workspace.mount({ main: mainContainer.current })
      modules.workspace.addAnnotation(!!keycloak?.authenticated)

      divRef.current.appendChild(mainContainer.current)
    }
  }, [])

  return <div ref={divRef} />
}
