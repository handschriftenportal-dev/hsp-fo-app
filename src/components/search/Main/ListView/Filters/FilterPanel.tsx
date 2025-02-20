import clsx from 'clsx'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAsyncValue, useLoaderData } from 'react-router-dom'

import MuiGrid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/core/styles/makeStyles'
import CloseIcon from '@material-ui/icons/Close'

import { useSearchTranslation } from 'src/components/search/utils'
import { Filter } from 'src/components/shared/Filter'
import { Grid } from 'src/components/shared/Grid'
import { Help } from 'src/components/shared/Help'
import { searchActions } from 'src/contexts/actions/searchActions'
import { useHspObjectsByQuery } from 'src/contexts/discovery'
import { DiscoveryLoaderDataProps } from 'src/contexts/loader'
import { searchSelectors, selectors } from 'src/contexts/selectors'
import { Tooltip } from 'src/utils/Tooltip'
import { FilterQuery, useParsedSearchParams } from 'src/utils/searchparams'

import { FilterList } from './FilterList'

const useStyles = makeStyles((theme) => ({
  filterPanel: {
    paddingBottom: theme.spacing(4),
    background: theme.palette.platinum.main,
    transition: '2s',
    overscrollBehavior: 'none',
    [theme.breakpoints.up('sm')]: {
      maxHeight: '80vh',
      overflowY: 'scroll',
      overflowX: 'hidden',
    },
    // header height = ~170px / ~80px, "apply filters" button height = ~30px
    // TODO: needs proper fix, see issue #16314
    '@media (orientation: landscape)': {
      [theme.breakpoints.down('md')]: {
        maxHeight: 'calc(var(--hsp-search-window-vh, 1vh) * 100 - 80px - 30px)',
        overflowY: 'scroll',
        overflowX: 'hidden',
      },
    },
    [theme.breakpoints.down('xs')]: {
      maxHeight: 'calc(var(--hsp-search-window-vh, 1vh) * 100 - 170px - 30px)',
      overflowY: 'scroll',
      overflowX: 'hidden',
    },
  },
  head: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(5),
    paddingLeft: theme.spacing(2.5),
    flexWrap: 'wrap-reverse',
  },
  headLeft: {
    display: 'flex',
    flexGrow: 1,
  },
  headRight: {
    display: 'flex',
    alignItems: 'center',
  },
  bottom: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  results: {
    marginRight: theme.spacing(4),
  },
  // transistion styles copied from sidebar
  paddingOpen: {
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(30),
      transition: theme.transitions.create('padding', {
        duration: theme.transitions.duration.leavingScreen,
        easing: theme.transitions.easing.sharp,
      }),
    },
  },
  paddingClosed: {
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(8),
      transition: theme.transitions.create('padding', {
        duration: theme.transitions.duration.leavingScreen,
        easing: theme.transitions.easing.sharp,
      }),
    },
  },
}))

export function FilterPanel() {
  const cls = useStyles()
  const dispatch = useDispatch()
  const { searchT, searchTT } = useSearchTranslation()
  const params = useParsedSearchParams()

  const { unfilteredResult } = useAsyncValue() as DiscoveryLoaderDataProps

  const modifiedFq =
    useSelector(searchSelectors.getModifiedFilterQuery) || params.fq || {}
  // the predicted result gives us the remaining filters when applying the filter query.
  const { data: predictedResult } = useHspObjectsByQuery({
    ...params,
    fq: modifiedFq,
  })

  const showFilterList = useSelector(searchSelectors.getShowFilterList)
  const sideBarOpen = useSelector(selectors.getSidebarOpen)

  const predictedFacets = predictedResult?.metadata.facets || {}
  const unfilteredStats = unfilteredResult?.metadata.stats || {}

  const filterPanelOpen = sideBarOpen
    ? clsx(cls.filterPanel, cls.paddingOpen)
    : clsx(cls.filterPanel, cls.paddingClosed)

  function closeAndDiscard() {
    dispatch(searchActions.setShowFilterList(!showFilterList))
    dispatch(
      searchActions.setModifiedFilterQuery({
        ...params.fq,
      }),
    )
  }
  function handleFilterChanged(
    filterName: string,
    selected: FilterQuery[keyof FilterQuery],
  ) {
    const _selected =
      Array.isArray(selected) && selected.length === 0 ? undefined : selected

    dispatch(
      searchActions.setModifiedFilterQuery({
        ...modifiedFq,
        [filterName]: _selected,
      }),
    )
  }
  useEffect(() => {
    const close = (e: { key: string }) => {
      if (e.key === 'Escape') {
        dispatch(searchActions.setShowFilterList(!showFilterList))
      }
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [])

  useEffect(() => {
    return () => {
      dispatch(searchActions.setShowFilterList(false))
    }
  }, [])

  return (
    <Grid className={filterPanelOpen}>
      <MuiGrid container justifyContent="center">
        <MuiGrid item xs={12} className={cls.head}>
          <div className={cls.headLeft}>
            <Filter
              filterName="described-object-facet"
              filterQuery={modifiedFq}
              facets={predictedFacets}
              stats={unfilteredStats}
              onChange={(selected) =>
                handleFilterChanged('described-object-facet', selected)
              }
            />
            <Filter
              filterName="digitized-object-facet"
              filterQuery={modifiedFq}
              facets={predictedFacets}
              stats={unfilteredStats}
              onChange={(selected) =>
                handleFilterChanged('digitized-object-facet', selected)
              }
            />
            <Filter
              filterName="digitized-iiif-object-facet"
              filterQuery={modifiedFq}
              facets={predictedFacets}
              stats={unfilteredStats}
              onChange={(selected) =>
                handleFilterChanged('digitized-iiif-object-facet', selected)
              }
            />
          </div>
          <div className={cls.headRight}>
            <Typography className={cls.results} variant="button">
              {predictedResult &&
                searchTT(
                  {
                    numFound: predictedResult.metadata.numFound.toString(),
                  },
                  'filterPanel',
                  'filterResult',
                )}
            </Typography>
            <Tooltip title={searchT('filterPanel', 'discardChanges')}>
              <IconButton
                onClick={closeAndDiscard}
                aria-label={searchT('filterPanel', 'discardChanges')}
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </div>
        </MuiGrid>
        <FilterList
          facets={predictedFacets}
          stats={unfilteredStats}
          filterQuery={modifiedFq}
          onChange={handleFilterChanged}
        />
      </MuiGrid>
      <div className={cls.bottom}>
        <Help
          html={searchT('filterPanel', 'help')}
          aria-label={searchT('filterPanel', 'helpLabel')}
        />
      </div>
    </Grid>
  )
}
