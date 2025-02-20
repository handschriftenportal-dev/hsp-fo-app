import { expect, test } from '@jest/globals'
import fetchMock from 'fetch-mock'

fetchMock.mock(
  'https://api.digitale-sammlungen.de/iiif/image/v2/bsb00087339_00003/info.json',
  { body: {} },
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
