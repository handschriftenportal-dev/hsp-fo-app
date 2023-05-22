/*
 * MIT License
 *
 * Copyright (c) 2023 Staatsbibliothek zu Berlin - Preußischer Kulturbesitz
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import { createContext, useContext, useEffect, useState } from 'react'

// Data structure provided by /api/tracking.
// Assembled from environment variables.
export interface FeatureFlagConfig {
  cms: boolean
  retroDescDisplay: boolean
}

export class FeatureFlags {
  public isLoaded = false
  private eventTarget = new EventTarget()
  private flags = {
    cms: false,
    retroDescDisplay: false,
  }

  constructor() {
    this.load()
  }

  addEventListener(type: string, handler: () => void) {
    this.eventTarget.addEventListener(type, handler)

    return () => {
      this.eventTarget.removeEventListener(type, handler)
    }
  }

  async load() {
    const response = await fetch('/api/features')

    if (!response.status) {
      console.error('error fetching feature flags')
    }

    const config = (await response.json()) as FeatureFlagConfig
    this.flags.cms = config.cms
    this.flags.retroDescDisplay = config.retroDescDisplay
    this.isLoaded = true
    this.eventTarget.dispatchEvent(new CustomEvent('loaded'))
  }

  get cms() {
    return this.flags.cms
  }

  get retroDescDisplay() {
    return this.flags.retroDescDisplay
  }
}

export const FeatureFlagsContext = createContext<FeatureFlags | undefined>(
  undefined
)

export function useFeatureFlags() {
  const flags = useContext(FeatureFlagsContext) as FeatureFlags
  const [loaded, setLoaded] = useState(flags.isLoaded)

  useEffect(() => {
    if (!loaded) {
      return flags.addEventListener('loaded', () => setLoaded(true))
    }
  }, [])

  return flags
}
