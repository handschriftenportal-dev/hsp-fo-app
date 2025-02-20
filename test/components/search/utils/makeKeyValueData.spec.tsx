import expect from 'expect'
import de from 'locales/de/search.json'
import { hspMockNormObject, hspMockObject } from 'test/mocks/hspMockObjects'

import { dataTableFieldsLeft } from 'src/components/search/config'
import { createTranslate } from 'src/components/search/utils'
import { makeKeyValueData } from 'src/components/search/utils/makeKeyValueData'

interface DataType {
  'Entstehungsort/-raum'?: {
    value: string
    id: string[]
  }
  Ort?: {
    value: string
    id: string[]
  }
}

describe('Kod core table generation', function () {
  test('if normdata is transformed correctly for table', () => {
    const searchT = createTranslate(de)
    const data: DataType = makeKeyValueData(
      dataTableFieldsLeft,
      hspMockNormObject,
      searchT,
    )

    expect(data).toHaveProperty('Entstehungsort/-raum')
    expect(data['Entstehungsort/-raum']).toEqual({
      value: 'Süddeutschland / Bayern (?)',
      id: [
        'NORM-175b489e-555f-38e4-9371-cc7a4336ba97',
        'NORM-21dba34d-74f8-31cb-8d42-e34579c40946',
      ],
    })
    expect(data).toHaveProperty('Ort')
    expect(data.Ort).toEqual({
      value: 'Augsburg',
      id: ['NORM-175b489e-555f-38e4-9371-cc7a4336ba97'],
    })
  })

  test('when normdata is null no normobject is created ', () => {
    const searchT = createTranslate(de)
    const data: DataType = makeKeyValueData(
      dataTableFieldsLeft,
      hspMockObject,
      searchT,
    )

    expect(data).toHaveProperty('Entstehungsort/-raum')
    expect(data['Entstehungsort/-raum']).toEqual('Süddeutschland / Bayern (?)')
    expect(data).toHaveProperty('Ort')
    expect(data.Ort).toEqual('Augsburg')
  })
})
