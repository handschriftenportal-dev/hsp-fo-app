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

import { useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'

/**
 * Emulates the native scrolling behaviour of the browser:
 *
 * 1. On page transitions via links (push state) scroll to the top of the page.
 * 2. On page transitions via browser navigation buttons (pop state) restore scroll position.
 *
 * With react-router point 2 works be default. So we need to implement point 1 here.
 */
export function Scrolling() {
  const location = useLocation()
  const history = useHistory()

  useEffect(() => {
    // Only scroll on push state events (link clicks).
    //
    // Do not scroll if the url contains a hash because
    // most likely another component will handle scrolling
    // in that case.
    if (history.action === 'PUSH' && !location.hash) {
      window.scrollTo(0, 0)
    }
  }, [location.pathname, location.search])

  return null
}
