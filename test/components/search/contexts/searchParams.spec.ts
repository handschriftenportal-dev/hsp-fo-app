import expect from 'expect'

import { FilterQuery, toSearchParams } from 'src/utils/searchparams'

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
})
