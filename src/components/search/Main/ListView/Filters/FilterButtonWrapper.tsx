import clsx from 'clsx'
import React from 'react'
import { batch, useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import makeStyles from '@material-ui/core/styles/makeStyles'
import useTheme from '@material-ui/core/styles/useTheme'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import { searchActions } from 'src/contexts/actions/searchActions'
import { searchSelectors } from 'src/contexts/selectors'
import { toSearchParams, useParsedSearchParams } from 'src/utils/searchparams'

import { FilterButton } from './FilterButton'

const useStyles = makeStyles((theme) => ({
  center: {
    [theme.breakpoints.up('lg')]: {
      width: '50%',
    },
    [theme.breakpoints.down('lg')]: {
      width: '75%',
    },
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  // style right is same as topbar right in app
  right: {
    width: '50%',
    left: 'calc(100% / 3)',
    [theme.breakpoints.down('sm')]: {
      left: '40%',
    },
  },
  filterBtnRight: {
    position: 'fixed',
  },
  applyBtnRight: {
    position: 'relative',
  },
  mobile: {
    marginRight: theme.spacing(3),
    marginLeft: theme.spacing(3),
    minWidth: '231px',
  },
}))

interface FilterButtonWrapperProps {
  isApplyButton: boolean
  renderBtn?: boolean
}

export function FilterButtonWrapper(props: Readonly<FilterButtonWrapperProps>) {
  const { isApplyButton, renderBtn } = props
  const cls = useStyles()
  const theme = useTheme()
  const dispatch = useDispatch()
  const mobile = useMediaQuery(theme.breakpoints.down('xs'), { noSsr: true })
  const navigate = useNavigate()
  const params = useParsedSearchParams()

  const modifiedFq =
    useSelector(searchSelectors.getModifiedFilterQuery) || params.fq || {}
  const showFilterList = useSelector(searchSelectors.getShowFilterList)

  function toggle() {
    dispatch(searchActions.setShowFilterList(!showFilterList))
  }

  function handleApplyFilter() {
    batch(() => {
      toggle()
      const searchParams = {
        ...params,
        start: 0,
        fq: modifiedFq,
      }
      navigate(`/search?${toSearchParams(searchParams)}`)
    })
  }

  const styleRight = isApplyButton
    ? clsx(cls.applyBtnRight, cls.right)
    : clsx(cls.filterBtnRight, cls.right)

  if (!renderBtn) {
    return null
  }

  return (
    <div className={mobile ? cls.mobile : styleRight}>
      <div className={mobile ? '' : cls.center}>
        {isApplyButton ? (
          <FilterButton
            isApplyBtn={isApplyButton}
            onClick={handleApplyFilter}
          />
        ) : (
          <FilterButton isApplyBtn={isApplyButton} onClick={toggle} />
        )}
      </div>
    </div>
  )
}
