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

import { expect, test } from '@jest/globals'
import fetchMock from 'fetch-mock'

fetchMock.mock(
  'https://api.digitale-sammlungen.de/iiif/image/v2/bsb00087339_00003/info.json',
  { body: {} }
)

// not importing, because files in /server are not modules
const { imageUrlFor } = require('../server/utils/images.js')

test('Should return adjusted IIIF thumbnail image', async function () {
  const hspDigitizedsMock = require('./mocks/hspDigitizeds.mock.json')
  const imageUrl: string = await imageUrlFor(hspDigitizedsMock)
  const expected =
    'https://api.digitale-sammlungen.de/iiif/image/v2/bsb00087339_00003/full/1200,/0/default.jpg'
  expect(imageUrl).toEqual(expected)
})
