import clsx from 'clsx'
import React, { useRef } from 'react'

import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import { makeStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import SearchIcon from '@material-ui/icons/Search'

import { useSearchTranslation } from 'src/components/search/utils'

const useStyles = makeStyles((theme) => ({
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
  const cls = useStyles()
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
        <IconButton className={cls.iconContainer} onClick={handleClearInput}>
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
