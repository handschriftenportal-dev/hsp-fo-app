import qs from 'qs'

export async function fetchJson<TResult, TQuery = any>(
  fetcher: typeof fetch,
  path: string,
  query?: TQuery,
): Promise<TResult> {
  const url = query
    ? `${path}?${qs.stringify(query, { indices: false })}`
    : path

  try {
    const response = await fetcher(url)

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data: Received status ${response.status} (${response.statusText})`,
      )
    }

    try {
      return await response.json()
    } catch (jsonError) {
      throw new Error('Failed to parse JSON response')
    }
  } catch (networkError) {
    throw new Error(
      `Network error: Unable to fetch data from ${url}. ${networkError instanceof Error ? networkError.message : ''}`,
    )
  }
}
