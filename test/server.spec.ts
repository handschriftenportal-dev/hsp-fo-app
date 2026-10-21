import { expect, test } from '@jest/globals'
import fetchMock from 'fetch-mock'

import hspDigitizedsMock from './mocks/hspDigitizeds.mock.json'

fetchMock.mock(
  'https://api.digitale-sammlungen.de/iiif/image/v2/bsb00087339_00003/info.json',
  { body: {} },
)

// allowJs is disabled in tsconfig, so server/*.js files cannot be
// statically imported. Use require() for this one CommonJS module.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { imageUrlFor } = require('../server/utils/images.js')

test('Should return adjusted IIIF thumbnail image', async function () {
  const imageUrl: string = await imageUrlFor(hspDigitizedsMock)
  const expected =
    'https://api.digitale-sammlungen.de/iiif/image/v2/bsb00087339_00003/full/1200,/0/default.jpg'
  expect(imageUrl).toEqual(expected)
})

test('Should return the plain thumbnail when it is not an IIIF Image API URL', async function () {
  // Regression: a digitized object with a non-IIIF thumbnail-url-display plus a
  // manifest-url-display used to crash isIIIFImageUrl with
  // "Cannot read properties of undefined (reading 'filter')" because matchAll
  // produced no match. It must now fall back to the unmodified thumbnail.
  const thumbnail = 'https://example.org/thumbnails/abc.jpg'
  const imageUrl: string = await imageUrlFor({
    hspDigitizeds: [
      {
        'thumbnail-url-display': thumbnail,
        'manifest-url-display': 'https://example.org/iiif/abc/manifest.json',
      },
    ],
  })
  expect(imageUrl).toEqual(thumbnail)
})
