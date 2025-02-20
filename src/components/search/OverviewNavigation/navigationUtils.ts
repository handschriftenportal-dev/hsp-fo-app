import { HspObjectsByQueryOutput } from 'src/contexts/discovery'
import { ParsedSearchParams, toSearchParams } from 'src/utils/searchparams'

export function getPrevLocation(
  params: ParsedSearchParams,
  resultList: HspObjectsByQueryOutput,
  hspObjectIds: string[],
  currentIndex: number,
) {
  const isFirstOfResult = !params.start && currentIndex === 0
  const isFirstOfPage = currentIndex === 0
  let prevLocation: string
  if (isFirstOfResult) {
    prevLocation = ''
  } else if (isFirstOfPage) {
    prevLocation = `/search?${toSearchParams({
      ...params,
      start: (params.start ?? 0) - resultList.metadata.rows,
      hspobjectid: 'last',
    })}#prev`
  } else {
    prevLocation = `/search?${toSearchParams({
      ...params,
      hspobjectid: hspObjectIds[currentIndex - 1],
    })}#prev`
  }
  return prevLocation
}

export function getNextLocation(
  params: ParsedSearchParams,
  resultList: HspObjectsByQueryOutput,
  hspObjectIds: string[],
  currentIndex: number,
) {
  const isLastOfResult =
    resultList.metadata.start + currentIndex + 1 ===
    resultList.metadata.numFound
  const isLastOfPage = currentIndex === hspObjectIds.length - 1
  let nextLocation: string
  if (isLastOfResult) {
    nextLocation = ''
  } else if (isLastOfPage) {
    nextLocation = `/search?${toSearchParams({
      ...params,
      start: (params.start ?? 0) + resultList.metadata.rows,
      hspobjectid: 'first',
    })}#next`
  } else {
    nextLocation = `/search?${toSearchParams({
      ...params,
      hspobjectid: hspObjectIds[currentIndex + 1],
    })}#next`
  }
  return nextLocation
}
