import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { createRoot } from 'react-dom/client'

import { App } from './App'

const container = document.getElementById('app')
if (!container) throw new Error('Root element #app not found')
createRoot(container).render(<App />)
