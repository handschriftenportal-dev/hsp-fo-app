import { HspThemeProvider } from 'hsp-web-module'
import { SnackbarProvider } from 'notistack'
import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { FeatureFlagsProvider } from 'src/contexts/features'
import { initI18n } from 'src/contexts/i18n'
import { ModuleContext, createHspModules } from 'src/contexts/modules'
import { persistor, store } from 'src/contexts/state'

import { Routing } from './Routing'
import { TrackerProvider } from './contexts/tracking'

const reactQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 3 * 60 * 1000,
      retry: 3,
    },
  },
})

export function App() {
  initI18n()
  const modules = createHspModules()

  return (
    <QueryClientProvider client={reactQueryClient}>
      <HspThemeProvider>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <FeatureFlagsProvider>
              <TrackerProvider>
                <ModuleContext.Provider value={modules}>
                  <SnackbarProvider
                    maxSnack={3}
                    autoHideDuration={4000}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  >
                    <Routing />
                  </SnackbarProvider>
                </ModuleContext.Provider>
              </TrackerProvider>
            </FeatureFlagsProvider>
          </PersistGate>
        </Provider>
      </HspThemeProvider>
    </QueryClientProvider>
  )
}
