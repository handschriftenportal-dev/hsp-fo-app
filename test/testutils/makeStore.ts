import { createConfiguredStore } from 'src/contexts/createConfigureStore'
import { rootReducer } from 'src/contexts/reducer/rootReducer'
import { State } from 'src/contexts/types'

export const makeStore = (preloadedState?: State) =>
  createConfiguredStore(rootReducer, preloadedState)
