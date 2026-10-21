import clsx from 'clsx'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import { makeStyles } from 'tss-react/mui'

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Button from '@mui/material/Button'
import ClickAwayListener from '@mui/material/ClickAwayListener'

import { SearchInputField } from 'src/components/search/shared/SearchInput'
import { useSearchTranslation } from 'src/components/search/utils'
import { catalogActions } from 'src/contexts/actions/catalogActions'
import { useTranslation } from 'src/contexts/i18n'
import { catalogSelectors } from 'src/contexts/selectors'
import { useTracker } from 'src/contexts/tracking'
import {
  ParsedSearchParams,
  toSearchParams,
  useParsedSearchParams,
} from 'src/utils/searchparams'

const useStyles = makeStyles<{ containerWidth: number }>()(
  (theme, { containerWidth }) => ({
    accordion: {
      backgroundColor: theme.palette.liver.main,
      color: theme.palette.white.main,
      '&.Mui-expanded': { margin: 'unset' },
    },
    expand: { color: theme.palette.white.main },
    root: {
      margin: theme.spacing(0.5),
    },
    accordionDetailsWrapper: {
      backgroundColor: theme.palette.liver.main,
      marginBottom: theme.spacing(-0.5),
    },
    detailsWrapperOpen: {
      width: containerWidth,
      opacity: 1,
      transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
    },
    detailsWrapperClosed: {
      opacity: 0,
      transform: 'translateY(-10px)',
      transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
    },
    searchButton: {
      marginLeft: theme.spacing(1),
    },
  }),
)

interface FullTextSearchProps {
  containerWidth: number
}

export const FullTextSearch: React.FC<FullTextSearchProps> = (props) => {
  const { containerWidth } = props

  const { classes: cls } = useStyles({ containerWidth })
  const { t } = useTranslation()
  const { searchT } = useSearchTranslation()
  const navigate = useNavigate()
  const tracker = useTracker()
  const dispatch = useDispatch()
  const searchTerm = useSelector(catalogSelectors.getCatalogSearchTerm)

  const params: ParsedSearchParams = useParsedSearchParams()
  const { fq, q } = params

  const inputRefBar = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [catalogUrl, setCatalogUrl] = useState(
    `/catalogs?${toSearchParams({ q: searchTerm, fq })}`,
  )

  const toggleOpen = () => setOpen((prev) => !prev)

  function search() {
    tracker.trackSiteSearch('Catalogs', searchTerm)
  }

  function handleResetClick() {
    inputRefBar.current?.focus()
    dispatch(catalogActions.setSearchTerm(''))
  }
  function handleInputChange(ev: ChangeEvent<HTMLInputElement>): void {
    dispatch(catalogActions.setSearchTerm(ev.target.value))
  }
  function handleInputKeyDown(ev: React.KeyboardEvent<HTMLInputElement>): void {
    if (ev.key === 'Enter') {
      search()
      navigate(catalogUrl)
    }
  }

  useEffect(() => {
    dispatch(catalogActions.setSearchTerm(q ?? searchTerm))
  }, [q])
  useEffect(() => {
    setCatalogUrl(`/catalogs?${toSearchParams({ fq, q: searchTerm })}`)
  }, [searchTerm])

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div className={cls.root}>
        <Accordion
          className={cls.accordion}
          onChange={toggleOpen}
          expanded={open}
          square
        >
          <AccordionSummary
            className={clsx('addFocusableWhite')}
            expandIcon={<ArrowDropDownIcon className={cls.expand} />}
          >
            {t(`catalog.catalog-fulltext-search`)}
          </AccordionSummary>{' '}
          <div
            className={`${cls.accordionDetailsWrapper} ${
              open ? cls.detailsWrapperOpen : cls.detailsWrapperClosed
            }`}
          >
            <AccordionDetails>
              <SearchInputField
                searchTerm={searchTerm}
                handleInputKeyDown={handleInputKeyDown}
                handleResetClick={handleResetClick}
                handleInputChange={handleInputChange}
                aria-label={searchT('searchBar', 'search')}
                inputRefBar={inputRefBar}
              />
              <Button
                className={cls.searchButton}
                color="primary"
                to={catalogUrl}
                component={Link}
                onClick={search}
                aria-label={'searchButton'}
                variant="contained"
              >
                {searchT('searchBar', 'searchButton')}
              </Button>
            </AccordionDetails>
          </div>
        </Accordion>
      </div>
    </ClickAwayListener>
  )
}
