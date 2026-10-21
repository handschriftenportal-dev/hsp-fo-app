import { createContext, useContext } from 'react'

// The mobile layout scrolls inside the navigation root, not the window;
// exposing that element lets descendants share the header's scroll trigger.
export const ScrollContainerContext = createContext<HTMLElement | null>(null)

export const useScrollContainer = () => useContext(ScrollContainerContext)
