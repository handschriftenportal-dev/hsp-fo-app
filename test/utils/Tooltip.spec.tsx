import { fireEvent, render, screen } from '@testing-library/react'
import { type ReactNode } from 'react'

import { Tooltip } from 'src/utils/Tooltip'

// jsdom 20 has no PointerEvent, so fireEvent drops `pointerType`; polyfill it.
class FakePointerEvent extends MouseEvent {
  readonly pointerType: string
  constructor(type: string, init: PointerEventInit = {}) {
    super(type, init)
    this.pointerType = init.pointerType ?? ''
  }
}

beforeAll(() => {
  ;(globalThis as { PointerEvent?: typeof PointerEvent }).PointerEvent =
    FakePointerEvent as unknown as typeof PointerEvent
})

// Stub MUI's Tooltip to expose the `followCursor` prop and render the trigger.
// We assert the prop, not the positioning (layout jsdom can't render).
jest.mock('@mui/material/Tooltip', () => ({
  __esModule: true,
  default: ({
    children,
    followCursor,
  }: {
    children: ReactNode
    followCursor?: boolean
  }) => (
    <div data-testid="mui-tooltip" data-follow-cursor={String(followCursor)}>
      {children}
    </div>
  ),
}))

const followCursor = () =>
  screen.getByTestId('mui-tooltip').getAttribute('data-follow-cursor')

const renderTooltip = () =>
  render(
    <Tooltip title="Test">
      <button type="button">Trigger</button>
    </Tooltip>,
  )

describe('Tooltip wrapper - followCursor modality', () => {
  it('is element-anchored (followCursor off) by default', () => {
    renderTooltip()
    expect(followCursor()).toBe('false')
  })

  it('follows the cursor while a mouse is over the trigger', () => {
    renderTooltip()
    fireEvent.pointerEnter(screen.getByRole('button'), { pointerType: 'mouse' })
    expect(followCursor()).toBe('true')
  })

  // Regression (#19930): resetting on pointerleave snapped the closing tooltip
  // back to the anchored position. Keep cursor-following on through the leave.
  it('keeps cursor-following on when the pointer leaves (no anchored flash)', () => {
    renderTooltip()
    const trigger = screen.getByRole('button')
    fireEvent.pointerEnter(trigger, { pointerType: 'mouse' })
    fireEvent.pointerLeave(trigger)
    expect(followCursor()).toBe('true')
  })

  it('stays element-anchored for a touch pointer', () => {
    renderTooltip()
    fireEvent.pointerEnter(screen.getByRole('button'), { pointerType: 'touch' })
    expect(followCursor()).toBe('false')
  })

  // Regression: a mouse hover used to latch followCursor on, leaving a later
  // touch anchored to a stale cursor position.
  it('does not stick in cursor mode after a mouse hover then touch', () => {
    renderTooltip()
    const trigger = screen.getByRole('button')
    fireEvent.pointerEnter(trigger, { pointerType: 'mouse' })
    fireEvent.pointerLeave(trigger)
    fireEvent.pointerEnter(trigger, { pointerType: 'touch' })
    expect(followCursor()).toBe('false')
  })

  // Stub `:focus-visible` on this node only (a global stub breaks RTL queries).
  it('switches to element-anchored on keyboard (focus-visible) focus', () => {
    renderTooltip()
    const trigger = screen.getByRole('button')
    jest
      .spyOn(trigger, 'matches')
      .mockImplementation((selector: string) => selector === ':focus-visible')

    fireEvent.pointerEnter(trigger, { pointerType: 'mouse' })
    expect(followCursor()).toBe('true')

    fireEvent.focus(trigger)
    expect(followCursor()).toBe('false')
  })
})
