import clsx from 'clsx'
import React from 'react'
import { Link } from 'react-router-dom'

import Button from '@material-ui/core/Button'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import CloseIcon from '@material-ui/icons/Close'
import SearchIcon from '@material-ui/icons/Search'

import { ParsedSearchParams, toSearchParams } from 'src/utils/searchparams'

import { useSearchTranslation } from '../utils'

const useStyles = makeStyles((theme) => ({
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
    [theme.breakpoints.down('sm')]: {
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
  btnType,
  className,
  preventScrollReset,
  backParams,
}: Readonly<Props>) {
  const cls = useStyles()
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true })
  const { searchT } = useSearchTranslation()

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
      to={`/search?${toSearchParams(backParams)}`}
    >
      {text}
    </Button>
  )
}
