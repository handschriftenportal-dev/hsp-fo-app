import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import Backdrop from '@material-ui/core/Backdrop'
import Collapse from '@material-ui/core/Collapse'
import makeStyles from '@material-ui/core/styles/makeStyles'

import { setTabIndexHits } from 'src/components/search/utils'
import { searchSelectors } from 'src/contexts/selectors'

import { FilterButtonWrapper } from './FilterButtonWrapper'
import { FilterPanel } from './FilterPanel'

const useStyles = makeStyles((theme) => ({
  filters: {
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  filtersOpen: {
    position: 'fixed',
    top: 80,
    [theme.breakpoints.down('xs')]: {
      top: 165,
    },
  },
  filtersClose: {
    position: 'absolute',
  },
}))

export function Filters() {
  const cls = useStyles()
  const [isApplyBtn, setIsApplyBtn] = useState(false)
  const showFilterList = useSelector(searchSelectors.getShowFilterList)

  const isTouch = window.matchMedia('(pointer:coarse)').matches

  if (isTouch) {
    const handleResize = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty(
        '--hsp-search-window-vh',
        `${vh}px`,
      )
    }
    ;['resize', 'orientationchange'].forEach((evt) =>
      window.addEventListener(evt, handleResize),
    )
    handleResize()
  }

  // React.useEffect(toggle, []) // use for lighthouse a11y testing
  useEffect(() => {
    const body = document.body

    if (showFilterList !== true && body) {
      body.style.overflow = 'auto'
      body.style.paddingRight = 'unset'
      setTabIndexHits(0)
    } else if (showFilterList === true && body) {
      body.style.overflow = 'hidden'
      setTabIndexHits(-1)
    }
  }, [showFilterList])

  return (
    <div
      aria-label="filter-drawer"
      data-testid="discovery-list-view-filters"
      className={
        showFilterList
          ? clsx(cls.filters, cls.filtersOpen)
          : clsx(cls.filters, cls.filtersClose)
      }
    >
      <div>
        <FilterButtonWrapper isApplyButton={false} renderBtn={!isApplyBtn} />
        <Collapse
          in={showFilterList}
          // By default the child will mount even if the component is closed.
          // But we want to render the child not before the component opens.
          mountOnEnter={true}
          // By default the child stays mounted even if the component closes.
          // But we want the child to unmount if the component closes.
          unmountOnExit={true}
          onEnter={() => setIsApplyBtn(true)}
          onExited={() => setIsApplyBtn(false)}
        >
          <FilterPanel />
        </Collapse>
        <FilterButtonWrapper isApplyButton={true} renderBtn={isApplyBtn} />
        <Backdrop open={showFilterList} />
      </div>
    </div>
  )
}
