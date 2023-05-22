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

// because cypress shadows some jest globals by mocha/chai globals
import { expect, test } from '@jest/globals'
import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { App } from 'src/App'
import 'test/mocks'

test('App: navigate all pages', async function () {
  render(<App />)

  fireEvent.click((await screen.findAllByRole('link', { name: /search/i }))[0])
  expect(window.location.href.endsWith('/search'))

  fireEvent.click(
    (await screen.findAllByRole('link', { name: /workspace/i }))[0]
  )
  expect(window.location.href.endsWith('/workspace'))

  fireEvent.click(await screen.findByRole('link', { name: /News/i }))
  expect(window.location.href.endsWith('/info'))

  fireEvent.click((await screen.findAllByRole('link', { name: /home/i }))[0])
  expect(window.location.href.endsWith('/'))

  await waitFor(() => {})
}, 10000) // increase timeout to 10s
