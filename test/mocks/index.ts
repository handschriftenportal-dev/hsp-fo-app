import { mockBackend } from './backend'
import { createHspWorkspace } from './hsp-workspace'

const _window = window as any
_window.createHspWorkspace = jest.fn(createHspWorkspace)

_window.scrollTo = () => {}

mockBackend()
