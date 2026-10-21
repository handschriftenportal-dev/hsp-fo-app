type Options = Record<string, number>

function sortAlpha(options: Options, missing: number): Options {
  let sortedOptions
  sortedOptions = Object.keys(options)
    .filter((el) => el !== '__MISSING__')
    .sort((a, b) => a.localeCompare(b))
    .reduce((acc, key) => ({ ...acc, [key]: options[key] }), {})

  if (missing) {
    sortedOptions = { __MISSING__: missing, ...sortedOptions }
  }
  return sortedOptions
}

export function getSortedFilterOptions(
  isBool: boolean | undefined,
  missing: number,
  options: Options,
  sort: string | undefined,
): Options {
  if (isBool) {
    return { true: options.true || 0 }
  } else if (sort === 'alpha') {
    return sortAlpha(options, missing)
  } else {
    return options
  }
}
