// react-shadow renders component styles into the shadow DOM via
// react-dom/server's `renderToString`. Under React 19, importing
// react-dom/server.browser instantiates `new MessageChannel()` and
// `new TextEncoder()` at module-eval time (top-level, ungated). jsdom provides
// neither, so without these the react-shadow import throws ReferenceError.
// Runs in setupFilesAfterEnv, before any test module is imported.
import { setImmediate } from 'timers'
import { TextEncoder } from 'util'

import './matchMedia'

if (typeof globalThis.TextEncoder === 'undefined') {
  globalThis.TextEncoder =
    TextEncoder as unknown as typeof globalThis.TextEncoder
}

// MessageChannel needs a working postMessage -> onmessage path because React's
// scheduler also picks it up (it otherwise falls back to setTimeout). A real
// worker_threads MessageChannel works but its OS-backed MessagePort stays
// ref'd via `port.onmessage` and blocks Jest from exiting. This setImmediate
// shim schedules a macrotask (matching MessageChannel semantics) without
// holding a persistent libuv handle.
if (typeof globalThis.MessageChannel === 'undefined') {
  type Listener = ((event: { data: unknown }) => void) | null

  class ShimMessagePort {
    onmessage: Listener = null
    private peer: ShimMessagePort | null = null

    _link(peer: ShimMessagePort) {
      this.peer = peer
    }

    postMessage(data?: unknown) {
      const peer = this.peer
      setImmediate(() => peer?.onmessage?.({ data }))
    }

    addEventListener(type: string, listener: Listener) {
      if (type === 'message') this.onmessage = listener
    }

    removeEventListener(type: string) {
      if (type === 'message') this.onmessage = null
    }

    start() {}
    close() {}
  }

  class ShimMessageChannel {
    port1 = new ShimMessagePort()
    port2 = new ShimMessagePort()

    constructor() {
      this.port1._link(this.port2)
      this.port2._link(this.port1)
    }
  }

  globalThis.MessageChannel =
    ShimMessageChannel as unknown as typeof globalThis.MessageChannel
  globalThis.MessagePort =
    ShimMessagePort as unknown as typeof globalThis.MessagePort
}

if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

if (typeof globalThis.IntersectionObserver === 'undefined') {
  globalThis.IntersectionObserver = class {
    root = null
    rootMargin = ''
    thresholds = []
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  } as unknown as typeof IntersectionObserver
}

export {}
