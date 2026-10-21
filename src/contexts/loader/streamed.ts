/**
 * Marks a loader promise as streamed to <Await>. Attaches a no-op rejection
 * handler so the rejection is not reported as unhandled in the gap before
 * <Await> subscribes (defer() did this internally in v6). Returns the same
 * promise; <Await>/errorElement still receive the rejection.
 */
export const streamed = <T>(promise: Promise<T>): Promise<T> => {
  promise.catch(() => {})
  return promise
}
