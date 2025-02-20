import useTheme from '@material-ui/core/styles/useTheme'
import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery'

export function getFilterListCols() {
  const theme = useTheme()

  const xl = useMediaQuery(theme.breakpoints.only('xl'), { noSsr: true })
  const lg = useMediaQuery(theme.breakpoints.only('lg'), { noSsr: true })
  const md = useMediaQuery(theme.breakpoints.only('md'), { noSsr: true })
  const sm = useMediaQuery(theme.breakpoints.only('sm'), { noSsr: true })
  const xs = useMediaQuery(theme.breakpoints.only('xs'), { noSsr: true })

  if (xl || lg) return 4
  if (md) return 3
  if (sm) return 2
  if (xs) return 1
  return 0
}
