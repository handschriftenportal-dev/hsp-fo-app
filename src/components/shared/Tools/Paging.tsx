import clsx from 'clsx'
import React, { useEffect, useRef } from 'react'
import { Link, useAsyncValue, useLocation } from 'react-router-dom'

import { useMediaQuery } from '@material-ui/core'
import makeStyles from '@material-ui/core/styles/makeStyles'
import useTheme from '@material-ui/core/styles/useTheme'
import Pagination, {
  PaginationRenderItemParams,
} from '@material-ui/lab/Pagination'
import PaginationItem from '@material-ui/lab/PaginationItem'

import { useSearchTranslation } from 'src/components/search/utils'
import { DiscoveryLoaderDataProps } from 'src/contexts/loader'
import { toSearchParams, useParsedSearchParams } from 'src/utils/searchparams'

import { PaginationSkeleton } from '../Skeletons/PaginationSkeleton'

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      justifyContent: 'center',
    },
  },
  itemTypo: theme.typography.caption,
  bottom: {
    margin: 'auto',
    width: '50%',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(6),
    [theme.breakpoints.only('xs')]: {
      width: '100%',
    },
  },
}))

interface Props {
  isBottom?: boolean
}

export function Paging(props: Readonly<Props>) {
  const { isBottom } = props
  const params = useParsedSearchParams()
  const parsedLocation = useLocation()
  const cls = useStyles()
  const { searchT, searchTT } = useSearchTranslation()

  const asyncValue = useAsyncValue() as DiscoveryLoaderDataProps
  const theme = useTheme()
  const smallerThanMd = useMediaQuery(theme.breakpoints.down('md'), {
    noSsr: true,
  })

  const isPaginationClick = useRef(false)

  useEffect(() => {
    if (isPaginationClick.current) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      isPaginationClick.current = false
    }
  }, [parsedLocation])

  if (!asyncValue) {
    return (
      <PaginationSkeleton
        className={clsx(cls.root, { [cls.bottom]: isBottom })}
      />
    )
  }

  const { searchResult } = asyncValue

  const { numFound, start, rows } = searchResult.metadata

  if (numFound < 1 || rows < 1) {
    return null
  }

  const pageLength = Math.ceil(numFound / rows)
  const pageIndex = Math.floor(start / rows) // zero-based

  const renderItem = (item: PaginationRenderItemParams) => {
    const disabled =
      item.page === 0 || item.page === pageIndex + 1 || item.page > pageLength

    let ariaLabel
    if (item.type === 'previous') {
      ariaLabel = searchT('paging', 'goToPreviousPage')
    } else if (item.type === 'next') {
      ariaLabel = searchT('paging', 'goToNextPage')
    } else if (item.type === 'page') {
      ariaLabel = searchTT(
        { pageNumber: item.page.toString() },
        'paging',
        'goToPage',
      )
    } else {
      ariaLabel = ''
    }

    const to = `${parsedLocation.pathname}?${toSearchParams({
      ...params,
      start: (item.page - 1) * rows,
    })}`

    return (
      <PaginationItem
        {...(item as any)}
        className={clsx(cls.itemTypo)}
        component={Link}
        to={to}
        disabled={disabled}
        aria-label={ariaLabel}
        onClick={() => {
          isPaginationClick.current = true
        }}
      />
    )
  }

  return (
    <Pagination
      aria-label={
        isBottom ? 'Pagination navigation bottom' : 'Pagination navigation'
      }
      className={clsx(cls.root, { [cls.bottom]: isBottom })}
      count={pageLength}
      page={pageIndex + 1}
      renderItem={renderItem}
      siblingCount={0}
      size={smallerThanMd ? 'small' : 'medium'}
    />
  )
}
