import clsx from 'clsx'
import React from 'react'
import { useLocation } from 'react-router'
import { makeStyles } from 'tss-react/mui'

import Checkbox from '@mui/material/Checkbox'

import { useSearchTranslation } from 'src/components/search/utils'

const useStyles = makeStyles()((theme) => ({
  checkbox: {
    paddingLeft: theme.spacing(1.5),
  },
  outlineWhite: {
    '&.MuiCheckbox-root.Mui-focusVisible input+img': {
      outline: `${theme.spacing(0.5)} solid ${theme.palette.white.main} !important`,
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
  const { classes: cls } = useStyles()
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
