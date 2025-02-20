import { clsx } from 'clsx'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import makeStyles from '@material-ui/core/styles/makeStyles'

import { searchSelectors } from 'src/contexts/selectors'
import { toSearchParams } from 'src/utils/searchparams'

import { NormPopover, PopoverEntry } from './NormPopover'

const useStyles = makeStyles((theme) => ({
  link: {
    color: theme.palette.primary.main,
    alignItems: 'center',
    display: 'flex',
  },
}))

export interface AuthorityEntryType {
  value: string
  id: string | string[]
}

interface NormEntryProps {
  normEntry: AuthorityEntryType
}
export function NormEntry({ normEntry }: Readonly<NormEntryProps>) {
  const cls = useStyles()

  const searchParams = useSelector(searchSelectors.getSearchParams)

  const [authParams, setAuthParams] = useState(
    `/authority-files?${toSearchParams({ authorityfileid: normEntry.id[0] })}`,
  )
  useEffect(() => {
    const newParams = toSearchParams({
      ...searchParams,
      authorityfileid: normEntry.id[0],
      hspobjectid: undefined,
      fromWorkspace: undefined,
    })
    setAuthParams(`/authority-files?${newParams}`)
  }, [searchParams, normEntry.id])

  return (
    <>
      {Array.isArray(normEntry.id) && normEntry.id.length > 1 ? (
        <NormPopover
          classNameLink={clsx(cls.link, 'addFocusableWithOutline')}
          normEntry={normEntry as PopoverEntry}
        />
      ) : (
        <Link
          className={clsx(cls.link, 'addFocusableWithOutline')}
          to={authParams}
        >
          {normEntry.value}
        </Link>
      )}
    </>
  )
}
