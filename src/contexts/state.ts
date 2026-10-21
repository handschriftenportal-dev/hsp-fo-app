import { persistReducer, persistStore } from 'redux-persist'
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2'
import storageSession from 'redux-persist/lib/storage/session'

import { createConfiguredStore } from './createConfigureStore'
import { rootReducer } from './reducer/rootReducer'
import SearchTransform from './searchTransform'

const persistConfig = {
  key: 'hsp/app',
  storage: storageSession,
  stateReconciler: autoMergeLevel2,
  transforms: [SearchTransform],
}

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(
  persistConfig,
  rootReducer,
)

export const store = createConfiguredStore(persistedReducer)

export const persistor = persistStore(store)
