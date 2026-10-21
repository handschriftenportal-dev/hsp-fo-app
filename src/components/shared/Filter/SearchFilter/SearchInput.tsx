import clsx from 'clsx'
import React, { useRef } from 'react'
import { makeStyles } from 'tss-react/mui'

import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import ListItemIcon from '@mui/material/ListItemIcon'
import OutlinedInput from '@mui/material/OutlinedInput'

import { useSearchTranslation } from 'src/components/search/utils'

const useStyles = makeStyles()((theme) => ({
  iconContainer: { minWidth: 'auto', padding: 0 },
  icon: { paddingRight: theme.spacing(0.5) },
  closeIcon: { cursor: 'pointer' },
  inputBase: {
    backgroundColor: 'white',
    marginBottom: theme.spacing(0.5),
    width: '100%',
  },
  input: { paddingLeft: theme.spacing(1) },
}))

interface SearchInputProps {
  debouncedQuery: string
  filterName: string
  inputQuery: string
  setInputQuery: (input: string) => void
}

export const SearchInput: React.FC<SearchInputProps> = ({
  debouncedQuery,
  filterName,
  inputQuery,
  setInputQuery,
}) => {
  const { classes: cls } = useStyles()
  const { searchT } = useSearchTranslation()
  const inputRef = useRef<HTMLInputElement>(null)

  const ariaLabel = `${searchT('searchBar', 'search')}: ${searchT(
    'data',
    filterName,
    '__field__',
  )}`

  const handleClearInput = () => {
    setInputQuery('')
    inputRef.current?.focus()
  }

  const renderEndAdornment = () => (
    <InputAdornment position="end">
      {debouncedQuery.length === 0 ? (
        <ListItemIcon className={cls.iconContainer}>
          <SearchIcon className={cls.icon} />
        </ListItemIcon>
      ) : (
        <IconButton
          className={cls.iconContainer}
          onClick={handleClearInput}
          size="large"
        >
          <CloseIcon className={clsx(cls.icon, cls.closeIcon)} />
        </IconButton>
      )}
    </InputAdornment>
  )

  return (
    <OutlinedInput
      id={`filter-input-${filterName}`}
      className={cls.inputBase}
      onChange={(e) => setInputQuery(e.target.value)}
      value={inputQuery}
      inputRef={inputRef}
      endAdornment={renderEndAdornment()}
      inputProps={{
        'aria-label': ariaLabel,
        className: cls.input,
      }}
    />
  )
}
