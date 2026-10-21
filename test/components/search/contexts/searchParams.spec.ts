import expect from 'expect'

import {
  FilterQuery,
  setFilterValue,
  toSearchParams,
} from 'src/utils/searchparams'

describe('toSearchParams', function () {
  test('all parsed params undefined', function () {
    const searchParams = new URLSearchParams(toSearchParams({}))
    expect([...searchParams.keys()].length).toBe(0)
  })

  test('set hspobjectid', function () {
    const searchParams = new URLSearchParams(
      toSearchParams({ hspobjectid: 'xyz' }),
    )
    expect(searchParams.get('hspobjectid')).toBe('xyz')
  })

  test('set q', function () {
    const searchParams = new URLSearchParams(toSearchParams({ q: 'foo' }))
    expect(searchParams.get('q')).toBe('foo')
  })

  test('set hl', function () {
    let searchParams = new URLSearchParams(toSearchParams({ hl: true }))
    expect(searchParams.get('hl')).toBe('true')
    searchParams = new URLSearchParams(toSearchParams({ hl: false }))
    expect(searchParams.get('hl')).toBeNull()
  })

  test('set start', function () {
    const searchParams = new URLSearchParams(toSearchParams({ start: 3 }))
    expect(searchParams.get('start')).toBe('3')
  })

  test('set rows', function () {
    const searchParams = new URLSearchParams(toSearchParams({ rows: 6 }))
    expect(searchParams.get('rows')).toBe('6')
  })

  test('set qf', function () {
    const searchParams = new URLSearchParams(toSearchParams({ qf: 'baz' }))
    expect(searchParams.get('qf')).toBe('baz')
  })

  test('set fq', function () {
    const fq: FilterQuery = {
      field1: 'foo',
      field2: ['bar', 'baz'],
      field3: { from: 1600, to: 1650 },
    }
    const searchParams = new URLSearchParams(toSearchParams({ fq }))
    expect(searchParams.get('fq')).toBe(JSON.stringify(fq))
  })

  test('does not set fq for an empty filter query', function () {
    const searchParams = new URLSearchParams(toSearchParams({ fq: {} }))
    expect(searchParams.get('fq')).toBeNull()
  })

  test('does not set fq when all facets are undefined', function () {
    const fq: FilterQuery = { field1: undefined }
    const searchParams = new URLSearchParams(toSearchParams({ fq }))
    expect(searchParams.get('fq')).toBeNull()
  })

  test('sets fq when at least one facet is defined', function () {
    const fq: FilterQuery = { field1: undefined, field2: ['bar'] }
    const searchParams = new URLSearchParams(toSearchParams({ fq }))
    expect(searchParams.get('fq')).toBe(JSON.stringify(fq))
  })
})

describe('setFilterValue', function () {
  test('sets a facet value', function () {
    const result = setFilterValue({}, 'field1', ['foo'])
    expect(result).toEqual({ field1: ['foo'] })
  })

  test('removes the key when the selection is undefined', function () {
    const result = setFilterValue({ field1: ['foo'] }, 'field1', undefined)
    expect(result).toEqual({})
    expect('field1' in result).toBe(false)
  })

  test('removes the key when the selection is an empty array', function () {
    const result = setFilterValue({ field1: ['foo'] }, 'field1', [])
    expect(result).toEqual({})
    expect('field1' in result).toBe(false)
  })

  test('removing the last facet yields an empty query', function () {
    const result = setFilterValue({ field1: [true] }, 'field1', undefined)
    expect(Object.keys(result)).toHaveLength(0)
  })

  test('leaves other facets untouched', function () {
    const query: FilterQuery = { field1: ['foo'], field2: ['bar'] }
    const result = setFilterValue(query, 'field1', undefined)
    expect(result).toEqual({ field2: ['bar'] })
  })

  test('does not mutate the input query', function () {
    const query: FilterQuery = { field1: ['foo'] }
    const result = setFilterValue(query, 'field1', undefined)
    expect(query).toEqual({ field1: ['foo'] })
    expect(result).not.toBe(query)
  })
})
