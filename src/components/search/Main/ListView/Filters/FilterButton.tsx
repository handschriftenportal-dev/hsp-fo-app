import clsx from 'clsx'
import React from 'react'

import { ButtonBase } from '@material-ui/core'
import makeStyles from '@material-ui/core/styles/makeStyles'

import { useSearchTranslation } from 'src/components/search/utils'

const useStyles = makeStyles((theme) => ({
  root: {
    ...theme.typography.button,
    position: 'relative',
    padding: theme.spacing(0.5),
    textTransform: 'uppercase',
    cursor: 'pointer',
    color: 'white',
    textAlign: 'center',
    scrollMarginTop: '200px',
    scrollBehavior: 'smooth',
  },
  filterBtn: {
    width: '100%',
    background: theme.palette.liver.main,
    transition: 'all 20ms',
    '&:after': {
      position: 'absolute',
      content: '""',
      top: '100%',
      left: '48%',
      borderLeft: '12px solid transparent',
      borderRight: '12px solid transparent',
      borderTop: `12px solid ${theme.palette.liver.main}`,
    },
  },
  applyBtn: {
    width: '100%',
    background: theme.palette.primary.main,
    transition: 'all 20ms',
    '&:after': {
      position: 'absolute',
      content: '""',
      bottom: '100%',
      left: '48%',
      borderLeft: '12px solid transparent',
      borderRight: '12px solid transparent',
      borderBottom: `12px solid ${theme.palette.primary.main}`,
    },
  },
}))

interface Props {
  className?: string
  isApplyBtn: boolean
  onClick: () => void
}

export function FilterButton(props: Readonly<Props>) {
  const cls = useStyles()
  const { className, isApplyBtn, onClick } = props
  const { searchT } = useSearchTranslation()

  const title = isApplyBtn
    ? searchT('filterPanel', 'applyFilters')
    : searchT('filterPanel', 'filters')

  return (
    <ButtonBase
      className={clsx(
        cls.root,
        'addFocusableWithOutline',
        isApplyBtn ? cls.applyBtn : cls.filterBtn,
        className,
      )}
      onClick={onClick}
      id={isApplyBtn ? 'applyFilterOptions' : 'filterOptions'}
    >
      {title}
    </ButtonBase>
  )
}
