import React from 'react'
import { Link } from 'react-router-dom'

import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

import {
  ParsedSearchParams,
  useParsedSearchParams,
} from 'src/utils/searchparams'

import BackButton from '../../shared/BackButton'
import { useSearchTranslation } from '../../utils'

const useStyles = makeStyles((theme) => ({
  control: {
    display: 'flex',
    flexWrap: 'wrap',
    whiteSpace: 'nowrap',
    [theme.breakpoints.up('sm')]: {
      justifyContent: 'end',
    },
    [theme.breakpoints.only('xs')]: {
      paddingRight: theme.spacing(2),
    },
  },
  extendedSearchBtn: {
    [theme.breakpoints.only('xs')]: {
      marginRight: theme.spacing(2),
      marginLeft: theme.spacing(3),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
}))

interface Props {
  search: () => void
  extSearchParams: string
}

export default function BottomControl(props: Readonly<Props>) {
  const { searchT } = useSearchTranslation()

  const cls = useStyles()
  const { search, extSearchParams } = props
  const params: ParsedSearchParams = useParsedSearchParams()

  const backParams = {
    ...params,
    hspobjectid: undefined,
    isExtended: undefined,
    authorityfileid: undefined,
  }
  return (
    <div className={cls.control}>
      <BackButton
        backParams={backParams}
        preventScrollReset={true}
        btnType="cancel"
      />
      <Button
        color="primary"
        className={cls.extendedSearchBtn}
        component={Link}
        to={`/search?${extSearchParams}`}
        onClick={search}
        variant="contained"
        aria-label={searchT('extendedSearch', 'triggerExtendedSearch')}
      >
        {searchT('extendedSearch', 'triggerExtendedSearch')}
      </Button>
    </div>
  )
}
