import React, {
  ReactElement,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

// // Data structure provided by /api/tracking.
// // Assembled from environment variables.
export interface FeatureFlagConfig {
  annotation: boolean
  catalogs: boolean
}

type FeatureFlagsType = {
  annotation: boolean
  catalogs: boolean
  isLoaded: boolean
}

const defaultFlags: FeatureFlagsType = {
  annotation: false,
  catalogs: false,
  isLoaded: false,
}

type FeaturesContextType = FeatureFlagsType & {
  addEventListener: (type: string, handler: () => void) => () => void
}

export const FeatureFlagContext = createContext<
  FeaturesContextType | undefined
>(undefined)

export function FeatureFlagsProvider({
  children,
}: Readonly<{ children: ReactElement }>) {
  const [flags, setFlags] = useState<FeatureFlagsType>(defaultFlags)
  const eventTarget = new EventTarget()

  const addEventListener = (type: string, handler: () => void) => {
    eventTarget.addEventListener(type, handler)

    return () => {
      eventTarget.removeEventListener(type, handler)
    }
  }

  useEffect(() => {
    async function loadFeatureFlags() {
      const response = await fetch('/api/features')

      const config: FeatureFlagConfig = await response.json()
      setFlags({
        isLoaded: true,
        ...config,
      })
      eventTarget.dispatchEvent(new CustomEvent('loaded'))
    }

    loadFeatureFlags()
  }, [])

  const value = useMemo(() => ({ ...flags, addEventListener }), [flags])

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  )
}
export function useFeatureFlags() {
  const flags = useContext(FeatureFlagContext) as FeaturesContextType
  const [loaded, setLoaded] = useState(flags.isLoaded)

  useEffect(() => {
    if (!loaded) {
      return flags.addEventListener('loaded', () => setLoaded(true))
    }
  }, [])

  return flags
}
