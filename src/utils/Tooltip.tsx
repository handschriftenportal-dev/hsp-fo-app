import React, { useState } from 'react'

// eslint-disable-next-line no-restricted-imports -- this wrapper is the single allowed MUI Tooltip import
import MuiTooltip from '@mui/material/Tooltip'

interface Props {
  children: React.ReactElement | React.ReactElement[]
  disable?: boolean
  open?: boolean
  onClose?: () => void
  onOpen?: () => void
  title?: string
  className?: string
}

// `Element.matches(':focus-visible')` throws on engines that do not support the
// selector (e.g. jsdom under test); treat those as "not focus-visible".
const isFocusVisible = (element: Element): boolean => {
  try {
    return element.matches(':focus-visible')
  } catch {
    return false
  }
}

/**
 * App-wide Tooltip wrapper - use this instead of `@mui/material/Tooltip`
 * (enforced by the `no-restricted-imports` ESLint rule). It centralizes the HSP
 * tooltip conventions:
 * - cursor-following for mouse, element-anchored for keyboard/touch (Redmine #19930)
 * - `describeChild` so the tooltip is a description, not the control's a11y name
 * - an arrow, and a `disable`/empty-title escape hatch that renders no tooltip
 */
export function Tooltip(props: Readonly<Props>) {
  const { children, disable, open, onClose, onOpen, title } = props

  // `followCursor` makes the tooltip track the mouse, but MUI only updates its
  // anchor on mousemove - with keyboard focus or touch there is no cursor and
  // it falls back to the last position or {0,0}. So default to element-anchored
  // and enable cursor-following only for mouse interactions. See Redmine #19930.
  const [followCursor, setFollowCursor] = useState(false)

  if (disable || !title) {
    return <>{children}</>
  }

  // MUI anchors the tooltip to its single child element. Pass the child
  // through directly instead of wrapping it in an extra element: the former
  // wrapper <div> collapsed to 0x0 around absolutely-positioned children
  // (e.g. the Fab "add" button), anchoring the tooltip far from the control it
  // describes. Only the rare multi-child case still needs a wrapper, since the
  // MUI Tooltip accepts a single child.
  const child = (
    Array.isArray(children) ? (
      <span style={{ display: 'inherit' }}>{children}</span>
    ) : (
      children
    )
  ) as React.ReactElement<{
    onPointerEnter?: (event: React.PointerEvent) => void
    onFocus?: (event: React.FocusEvent) => void
  }>

  const childProps = child.props

  // Decide the modality when the tooltip opens: a mouse pointerenter follows the
  // cursor; touch/pen and keyboard focus stay element-anchored. It carries over
  // until the next open rather than clearing on leave - clearing mid-fade would
  // snap the closing tooltip back to its anchored position.
  // (A touch's pointerenter precedes MUI's long-press, so no touchstart hook.)
  const trigger = React.cloneElement(child, {
    onPointerEnter: (event: React.PointerEvent) => {
      setFollowCursor(event.pointerType === 'mouse')
      childProps.onPointerEnter?.(event)
    },
    onFocus: (event: React.FocusEvent) => {
      if (isFocusVisible(event.target)) {
        setFollowCursor(false)
      }
      childProps.onFocus?.(event)
    },
  })

  return (
    <MuiTooltip
      arrow={true}
      describeChild
      followCursor={followCursor}
      classes={{
        tooltip: props.className,
      }}
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      title={title}
    >
      {trigger}
    </MuiTooltip>
  )
}
