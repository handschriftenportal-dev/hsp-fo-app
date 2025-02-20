import clsx from 'clsx'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import { Grid, SinglePageWrapper } from 'src/components/shared/'
import { searchActions } from 'src/contexts/actions/searchActions'
import { extSearchSelectors } from 'src/contexts/selectors'
import { useTracker } from 'src/contexts/tracking'
import { toSearchParams, useParsedSearchParams } from 'src/utils/searchparams'

import { useSearchTranslation } from '../../utils'
import {
  getRsql,
  parseFromRSQL,
  useGetExtendedSearchTerm,
} from '../../utils/extendedSearch'
import BottomControl from './BottomControl'
import Preview from './Preview'
import SearchPanel from './SearchPanel'

const useStyles = makeStyles((theme) => ({
  root: {
    scrollMarginTop: '350px',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  title: {
    marginTop: theme.spacing(2),
    flexWrap: 'wrap',
  },
  description: {
    paddingTop: theme.spacing(1),
    [theme.breakpoints.only('xs')]: {
      paddingRight: theme.spacing(2),
      paddingLeft: theme.spacing(3.5),
    },
  },

  searchPanel: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(0.5),
  },
}))

interface Props {
  className?: string
}

export function ExtendedSearchView({ className }: Readonly<Props>) {
  const cls = useStyles()
  const { searchT } = useSearchTranslation()

  const dispatch = useDispatch()
  const params = useParsedSearchParams()
  const extFieldInfo = useSelector(extSearchSelectors.getExtendedFieldInfo)

  const searchGroup = useSelector(extSearchSelectors.getExtendedSearchGroups)
  const rsqlQuery = getRsql(searchGroup)
  const getExtendedSearchTerm = useGetExtendedSearchTerm()
  const preview = getExtendedSearchTerm(rsqlQuery, extFieldInfo)
  const navigate = useNavigate()
  const tracker = useTracker()

  useEffect(() => {
    if (params.isExtended && params.q) {
      const { searchList } = parseFromRSQL(params.q)
      dispatch(searchActions.setExtSearchList(searchList))
    }
  }, [params.q])

  const search = () => {
    tracker.trackSiteSearch('Extended search', preview)
    dispatch(searchActions.setModifiedFilterQuery(undefined))

    const searchParams = {
      sort: params.sort,
      hl: true,
      q: rsqlQuery,
      fq: params.fq,
      isExtended: true,
    }

    navigate(`/search?${toSearchParams(searchParams)}`)
  }

  const extSearchParams = toSearchParams({
    sort: params.sort,
    hl: true,
    q: rsqlQuery,
    fq: params.fq,
    isExtended: true,
  })

  return (
    <div id="hsp-search-main">
      <div className={clsx(cls.root, className)}>
        <Grid>
          <SinglePageWrapper>
            <Typography className={cls.title} variant="h1">
              {searchT('extendedSearch', 'extendedSearch')}
            </Typography>
          </SinglePageWrapper>
          <Box className={cls.description}>
            {searchT('searchBar', 'description')}
          </Box>
          <SearchPanel search={search} />
          <Preview preview={preview} />
          <BottomControl extSearchParams={extSearchParams} search={search} />
        </Grid>
      </div>
    </div>
  )
}
