import clsx from 'clsx'
import React from 'react'
import { useLocation } from 'react-router-dom'

import Checkbox from '@material-ui/core/Checkbox'
import { makeStyles } from '@material-ui/core/styles'

import { useSearchTranslation } from 'src/components/search/utils'

const useStyles = makeStyles((theme) => ({
  checkbox: {
    paddingLeft: theme.spacing(1.5),
  },
  outlineWhite: {
    '&.MuiCheckbox-root.Mui-focusVisible input+img': {
      outline: `${theme.spacing(0.5)}px solid ${theme.palette.white.main} !important`,
    },
  },
}))

interface FilterCheckboxProps {
  checked: boolean | undefined
  iconText: string
  onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void
  value?: string
}

export function FilterCheckbox({
  checked,
  iconText,
  onChange,
  value,
}: Readonly<FilterCheckboxProps>) {
  const cls = useStyles()
  const { searchT } = useSearchTranslation()
  const location = useLocation()
  const isCatalogFilter = location.pathname.includes('/catalogs')
  const generateAltText = (checked: boolean) =>
    `${iconText} ${searchT('filterPanel', checked ? 'checked' : 'unchecked')}`

  return (
    <Checkbox
      className={
        isCatalogFilter ? clsx(cls.checkbox, cls.outlineWhite) : cls.checkbox
      }
      color="primary"
      value={value}
      checked={checked}
      onChange={onChange}
      icon={
        <img src="/img/checkbox_unchecked.svg" alt={generateAltText(false)} />
      }
      checkedIcon={
        <img src="/img/checkbox_checked.svg" alt={generateAltText(true)} />
      }
    />
  )
}
