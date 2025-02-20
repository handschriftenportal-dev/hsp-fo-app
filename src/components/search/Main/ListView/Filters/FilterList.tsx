import clsx from 'clsx'
import React, { useState } from 'react'

import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import MuiGrid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'

import { filterGroups } from 'src/components/search/config'
import {
  chunkObject,
  getFilterListCols,
  useSearchTranslation,
} from 'src/components/search/utils'
import { Filter } from 'src/components/shared/Filter'
import { Facets, Stats } from 'src/contexts/discovery'
import { FilterQuery } from 'src/utils/searchparams/'

const useStyles = makeStyles((theme) => ({
  filter: {
    marginBottom: theme.spacing(1),
  },
  filterAccordion: {
    backgroundColor: 'transparent !important',
    borderBottom: '1px solid #aaa',
    boxShadow: 'none',
    fontSize: 15,
    margin: 'unset !important',
  },
  filterColumn: {
    width: 300,
    backgroundColor: 'transparent !important',
    padding: '20px',
  },
  filterDetails: {
    display: 'block',
    padding: 'unset',
    marginTop: theme.spacing(1),
  },
  filterSummary: {
    flexDirection: 'row-reverse',
    padding: '0px',
    '& .hsp-search-MuiIconButton-edgeEnd': {
      marginRight: '0px',
      padding: '8px',
    },
  },
  groupAccordion: {
    backgroundColor: 'inherit',
    boxShadow: 'none',
    margin: '8px 0',
    [theme.breakpoints.down('xs')]: {
      marginBottom: theme.spacing(1),
    },
  },
  groupDetails: {
    display: 'block',
    padding: 0,
  },
  groupSummary: {
    backgroundColor: 'white',
    fontWeight: 800,
    letterSpacing: '1px',
    lineHeight: '1.75',
    textTransform: 'uppercase',
  },
  filterList: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
  },
}))

interface Props {
  facets: Facets
  stats: Stats
  filterQuery: FilterQuery
  onChange: (
    filterName: string,
    selected: FilterQuery[keyof FilterQuery],
  ) => void
}

export function FilterList(props: Readonly<Props>) {
  const { facets, stats, filterQuery, onChange } = props
  const cls = useStyles()
  const { searchT } = useSearchTranslation()
  const [initalFQ] = useState(filterQuery)

  const cols = getFilterListCols()

  const filterGroupCols = chunkObject(filterGroups, cols)

  return (
    <MuiGrid item xs={12} className={cls.filterList}>
      {filterGroupCols.map((col) => {
        const colKeys = Object.keys(col)
        return (
          <div
            className={cls.filterColumn}
            key={`grid-for-${colKeys.join('-')}`}
          >
            {colKeys.map((groupName) => (
              <Accordion
                className={cls.groupAccordion}
                defaultExpanded={
                  cols > 1 ||
                  col[groupName].some(
                    (filterName: string) => filterName in initalFQ,
                  )
                }
                key={groupName}
                square={true}
              >
                <AccordionSummary
                  className={clsx(cls.groupSummary, cls.filterSummary)}
                  expandIcon={<ArrowDropDownIcon />}
                >
                  {searchT('filterPanel', 'filterGroups', groupName)}
                </AccordionSummary>
                <AccordionDetails className={cls.groupDetails}>
                  {col[groupName].map((filterName: string) => (
                    <Accordion
                      className={cls.filterAccordion}
                      defaultExpanded={filterName in initalFQ}
                      key={filterName}
                      square={true}
                      TransitionProps={{ unmountOnExit: true }}
                    >
                      <AccordionSummary
                        className={cls.filterSummary}
                        expandIcon={<ArrowDropDownIcon />}
                      >
                        {searchT('data', filterName, '__field__')}
                      </AccordionSummary>
                      <AccordionDetails className={cls.filterDetails}>
                        <Filter
                          className={cls.filter}
                          filterName={filterName}
                          filterQuery={filterQuery}
                          facets={facets}
                          stats={stats}
                          onChange={(selected) =>
                            onChange(filterName, selected)
                          }
                        />
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        )
      })}
    </MuiGrid>
  )
}
