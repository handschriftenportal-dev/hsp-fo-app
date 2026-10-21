import clsx from 'clsx'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useAsyncValue } from 'react-router'
import { makeStyles } from 'tss-react/mui'

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Button from '@mui/material/Button'
import ClickAwayListener from '@mui/material/ClickAwayListener'

import { Filter } from 'src/components/shared/Filter'
import { catalogActions } from 'src/contexts/actions/catalogActions'
import { useTranslation } from 'src/contexts/i18n'
import { DiscoveryLoaderDataProps } from 'src/contexts/loader'
import { catalogSelectors } from 'src/contexts/selectors'
import {
  FilterQuery,
  setFilterValue,
  toSearchParams,
  useParsedSearchParams,
} from 'src/utils/searchparams'

const useStyles = makeStyles()((theme) => ({
  accordion: {
    backgroundColor: theme.palette.liver.main,
    color: theme.palette.white.main,
    '&.Mui-expanded': { margin: 'unset' },
  },
  btn: {
    marginTop: theme.spacing(1),
  },
  // The neutral (no-change) state uses color="inherit" so the theme gives the
  // button its whiteSmoke background; without this the accordion's white text
  // color cascades in and the label is invisible on the light button. Pin the
  // default text color for that state (what v4's color="default" button used).
  neutralApply: {
    color: theme.palette.text.primary,
  },
  // v4 AccordionDetails defaulted to display:flex; MUI v5+ changed it to
  // display:block, which left flexDirection inert and shrank the Apply button
  // to auto width. Restore the flex column so it stretches full width again.
  details: { display: 'flex', flexDirection: 'column' },
  expand: { color: theme.palette.white.main },
  root: { margin: theme.spacing(0.5) },
}))

interface CatalogAccordionProps {
  filterName: string
}

export const CatalogAccordion: React.FC<CatalogAccordionProps> = ({
  filterName,
}) => {
  const { classes: cls } = useStyles()
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
    setFinalFq(() => setFilterValue(initialFq, filterName, selected))
  }

  const getApplyBtnColor = () => {
    return JSON.stringify(finalFq[filterName]) ===
      JSON.stringify(initialFq[filterName])
      ? 'inherit'
      : 'primary'
  }

  const applyBtnColor = getApplyBtnColor()

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
              className={clsx(
                cls.btn,
                applyBtnColor === 'inherit' && cls.neutralApply,
                'addFocusableWhite',
              )}
              color={applyBtnColor}
              component={Link}
              onClick={applyFilter}
              size="small"
              to={`/catalogs?${toSearchParams({ fq: finalFq })}`}
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
