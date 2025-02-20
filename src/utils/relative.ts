/**
 * @param href - absolute or relative href
 * @returns - relative href
 */
export function relative(href: string): string {
  try {
    const url = new URL(href)
    return url.pathname + url.search + url.hash
  } catch (err) {
    return href
  }
}
