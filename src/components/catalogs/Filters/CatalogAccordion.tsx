import clsx from 'clsx'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useAsyncValue } from 'react-router-dom'

import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import Button from '@material-ui/core/Button'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import makeStyles from '@material-ui/core/styles/makeStyles'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'

import { Filter } from 'src/components/shared/Filter'
import { catalogActions } from 'src/contexts/actions/catalogActions'
import { useTranslation } from 'src/contexts/i18n'
import { DiscoveryLoaderDataProps } from 'src/contexts/loader'
import { catalogSelectors } from 'src/contexts/selectors'
import {
  FilterQuery,
  toSearchParams,
  useParsedSearchParams,
} from 'src/utils/searchparams'

const useStyles = makeStyles((theme) => ({
  accordion: {
    backgroundColor: theme.palette.liver.main,
    color: theme.palette.white.main,
    '&.Mui-expanded': { margin: 'unset' },
  },
  btn: {
    marginTop: theme.spacing(1),
  },
  details: { flexDirection: 'column' },
  expand: { color: theme.palette.white.main },
  root: { margin: theme.spacing(0.5) },
}))

interface CatalogAccordionProps {
  filterName: string
}

export const CatalogAccordion: React.FC<CatalogAccordionProps> = ({
  filterName,
}) => {
  const cls = useStyles()
  const { t } = useTranslation()
  const { fq } = useParsedSearchParams()
  const dispatch = useDispatch()

  const modFilterQuery = useSelector(
    catalogSelectors.getCatalogModifiedFilterQuery,
  )
  const initialFq = modFilterQuery || fq || {}
  const [finalFq, setFinalFq] = useState(initialFq)
  const [open, setOpen] = useState(false)

  const { searchResult } = useAsyncValue() as DiscoveryLoaderDataProps

  const { facets: predictedFacets = {}, stats = {} } =
    searchResult?.metadata || {}

  const toggleOpen = () => setOpen((prev) => !prev)

  const applyFilter = () => {
    setOpen(false)
    dispatch(catalogActions.setModifiedFilterQuery(finalFq))
  }

  const handleFilterChange = (selected: FilterQuery[keyof FilterQuery]) => {
    setFinalFq((prev) => ({
      ...initialFq,
      [filterName]:
        Array.isArray(selected) && selected.length === 0 ? undefined : selected,
    }))
  }

  const getApplyBtnColor = () => {
    return JSON.stringify(finalFq[filterName]) ===
      JSON.stringify(initialFq[filterName])
      ? 'default'
      : 'primary'
  }

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div className={cls.root}>
        <Accordion
          className={cls.accordion}
          onChange={toggleOpen}
          expanded={open}
          square
          TransitionProps={{ unmountOnExit: true }}
        >
          <AccordionSummary
            className={clsx('addFocusableWhite')}
            expandIcon={<ArrowDropDownIcon className={cls.expand} />}
          >
            {t(`catalog.${filterName}`)}
          </AccordionSummary>
          <AccordionDetails className={cls.details}>
            <Filter
              filterQuery={finalFq}
              filterName={filterName}
              facets={predictedFacets}
              onChange={handleFilterChange}
              stats={stats}
            />
            <Button
              className={clsx(cls.btn, 'addFocusableWhite')}
              color={getApplyBtnColor()}
              component={Link}
              onClick={applyFilter}
              size="small"
              to={`?${toSearchParams({ fq: finalFq })}`}
              variant="contained"
            >
              {t('catalog.filterApply')}
            </Button>
          </AccordionDetails>
        </Accordion>
      </div>
    </ClickAwayListener>
  )
}
