import { jest } from '@jest/globals'

import { ActionCreator } from 'src/utils/stateUtils'

export function spyOnAction(
  actions: Record<string, ActionCreator<any>>,
  actionName: string,
) {
  const type = actions[actionName].type
  const spy = jest.spyOn(actions, actionName)
  ;(spy as jest.MockedFunction<(typeof actions)[typeof actionName]>).type = type
  return spy
}
