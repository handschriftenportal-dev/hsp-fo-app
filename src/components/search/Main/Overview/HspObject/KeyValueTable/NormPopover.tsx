import { useState } from 'react'
import { makeStyles } from 'tss-react/mui'

import { Link as MuiLink } from '@mui/material'
import Popover from '@mui/material/Popover'

import { useGetPreferredNames } from 'src/contexts/discovery/'

import { NormLink } from './NormLink'

const useStyles = makeStyles()((theme) => ({
  content: {
    padding: theme.spacing(2),
  },
  container: {
    color: theme.palette.primary.main,
    cursor: 'pointer',
    textDecoration: 'underline',
  },
}))

export interface PopoverEntry {
  id: string[]
  value: string
}

interface NormPopoverProps {
  classNameLink: string
  normEntry: PopoverEntry
}

export function NormPopover(props: Readonly<NormPopoverProps>) {
  const { normEntry, classNameLink } = props
  const { classes: cls } = useStyles()

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const ids = normEntry.id.map((entry) => entry)
  const { results } = useGetPreferredNames(ids)

  return (
    <>
      <MuiLink
        className={cls.container}
        aria-label="authority-files"
        onClick={(e) => handleClick(e)}
      >
        {normEntry.value}
      </MuiLink>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div className={cls.content}>
          {results.map((entry) => (
            <NormLink
              key={entry.id}
              id={entry.id}
              className={classNameLink}
              preferredName={entry.preferredName}
              error={entry.error}
            />
          ))}
        </div>
      </Popover>
    </>
  )
}
