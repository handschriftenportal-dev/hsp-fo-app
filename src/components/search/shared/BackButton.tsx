import clsx from 'clsx'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router'
import { makeStyles } from 'tss-react/mui'

import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import { ParsedSearchParams, toSearchParams } from 'src/utils/searchparams'

import { searchActions } from '../../../contexts/actions/searchActions'
import { useSearchTranslation } from '../utils'

const useStyles = makeStyles()((theme) => ({
  extendendBtn: {
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    whiteSpace: 'nowrap',
  },
  multiline: {
    width: 170,
    whiteSpace: 'normal',
    fontSize: '0.675rem',
    textAlign: 'right',
    lineHeight: '0.9rem',
  },
  backButton: {
    paddingLeft: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    paddingRight: theme.spacing(2),
    textWrap: 'nowrap',
    [theme.breakpoints.down('md')]: {
      textWrap: 'pretty',
      marginRight: 'unset',
      paddingRight: 'unset',
    },
  },
}))

interface Props {
  backParams: ParsedSearchParams
  btnType: 'cancel' | 'extendedBtn' | 'back' | 'backToKod'
  preventScrollReset: boolean
  className?: string
}

export default function BackButton({
  backParams,
  btnType,
  className,
  preventScrollReset,
}: Readonly<Props>) {
  const { classes: cls } = useStyles()
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true })
  const { searchT } = useSearchTranslation()
  const dispatch = useDispatch()

  let text = ''

  if (btnType === 'back') {
    text = mobile
      ? searchT('overview', 'buttonBackToSearchMobile')
      : searchT('overview', 'buttonBackToSearchDesktop')
  } else if (btnType === 'backToKod') {
    text = searchT('normOverview', 'back')
  } else if (btnType === 'cancel') {
    text = searchT('cancel')
  } else if (btnType === 'extendedBtn') {
    text = searchT('searchBar', 'backToNormalSearch')
  }

  // Honor the caller-provided backParams so the button returns to the previous
  // search state (query, filters, sort, paging) instead of a bare /search. The
  // "Zurück zur einfachen Suche" (extendedBtn) caller passes empty backParams,
  // which serializes to nothing and so still resets to /search as before.
  const serializedBackParams = toSearchParams(backParams)
  const backTo = serializedBackParams
    ? `/search?${serializedBackParams}`
    : '/search'

  return (
    <Button
      className={clsx(
        { [cls.extendendBtn]: btnType === 'extendedBtn' },
        { [cls.backButton]: btnType === 'back' },
        { [cls.multiline]: btnType === 'extendedBtn' },
        className,
      )}
      startIcon={btnType.includes('back') ? <SearchIcon /> : <CloseIcon />}
      preventScrollReset={preventScrollReset}
      component={Link}
      onClick={() => {
        dispatch(searchActions.setSearchTerm(backParams.q ?? ''))
      }}
      to={backTo}
    >
      {text}
    </Button>
  )
}
