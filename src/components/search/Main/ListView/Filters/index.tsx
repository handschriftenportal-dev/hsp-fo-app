import clsx from 'clsx'
import { ReactElement, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from 'tss-react/mui'

import Backdrop from '@mui/material/Backdrop'
import Collapse from '@mui/material/Collapse'
import Slide from '@mui/material/Slide'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import useScrollTrigger from '@mui/material/useScrollTrigger'

import { useScrollContainer } from 'src/components/navigation/mobile/ScrollContainerContext'
import { setTabIndexHits } from 'src/components/search/utils'
import { searchSelectors } from 'src/contexts/selectors'

import { FilterButtonWrapper } from './FilterButtonWrapper'
import { FilterPanel } from './FilterPanel'

const useStyles = makeStyles()((theme) => ({
  filters: {
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  filtersOpen: {
    position: 'fixed',
    top: 80,
    [theme.breakpoints.down('sm')]: {
      top: 165,
    },
  },
  filtersClose: {
    position: 'absolute',
  },
  // Pin the closed mobile filter button below the header (same offset as the
  // open panel) so it tracks the header's hide-on-scroll (#24567).
  mobileFilterBar: {
    position: 'fixed',
    top: 165,
    left: 0,
    right: 0,
  },
}))

export function Filters() {
  const { classes: cls } = useStyles()
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true })
  const [isApplyBtn, setIsApplyBtn] = useState(false)
  const showFilterList = useSelector(searchSelectors.getShowFilterList)

  // Same scroll source as the header, so the two slide together.
  const scrollContainer = useScrollContainer()
  const scrolledDown = useScrollTrigger({
    target: scrollContainer ?? undefined,
  })

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

  const filterButton = (
    <FilterButtonWrapper isApplyButton={false} renderBtn={!isApplyBtn} />
  )

  // On mobile the closed button slides with the header; desktop keeps its layout.
  const closedFilterButton: ReactElement =
    mobile && !showFilterList ? (
      <Slide appear={false} direction="down" in={!scrolledDown}>
        <div data-testid="mobile-filter-bar" className={cls.mobileFilterBar}>
          {filterButton}
        </div>
      </Slide>
    ) : (
      filterButton
    )

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
        {closedFilterButton}
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
        <Backdrop
          open={showFilterList}
          // v4's Backdrop defaulted to zIndex -1, so this standalone backdrop
          // sat behind the filter panel (dimming the page, not the panel). MUI
          // v5+ dropped that default; without it the backdrop stacks above the
          // panel and blocks all clicks. Restore the negative z-index.
          sx={{ zIndex: -1 }}
        />
      </div>
    </div>
  )
}
