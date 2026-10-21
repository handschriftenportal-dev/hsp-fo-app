import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'

import { useTheme } from '@mui/material/styles'

import { useKeycloak } from 'src/contexts/Keycloak'
import { actions } from 'src/contexts/actions/actions'
import { useModules, useSetupModulesForPage } from 'src/contexts/modules'
import { useTrackPageView } from 'src/contexts/tracking'

export function Workspace({ hasKeycloak }: { hasKeycloak?: boolean }) {
  const modules = useModules()
  const theme = useTheme()
  const dispatch = useDispatch()

  const { keycloak } = useKeycloak()
  const effectiveKeycloak = hasKeycloak ? keycloak : null
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
      divRef.current.appendChild(mainContainer.current)
    }
  }, [])

  useEffect(() => {
    // Mark.js (used by the TEI viewer's search) produces one mutation record
    // per highlight wrap, so a single search can fire this callback hundreds
    // of times in quick succession. Coalesce via requestAnimationFrame so the
    // Redux dispatch and addAnnotation call run at most once per frame.
    let rafId: number | null = null
    const handleMutations = () => {
      rafId = null
      dispatch(
        actions.setIsMiradorAddVisible(
          modules.workspace.getMiradorWorkspaceAddVisible(),
        ),
      )
      modules.workspace.addAnnotation(!!effectiveKeycloak?.authenticated)
    }
    const observer = new MutationObserver(() => {
      if (rafId === null) {
        rafId = requestAnimationFrame(handleMutations)
      }
    })

    if (divRef.current) {
      observer.observe(divRef.current, {
        attributes: true,
        subtree: true,
        childList: true,
      })
    }

    return () => {
      observer.disconnect()
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [])

  return <div ref={divRef} />
}
