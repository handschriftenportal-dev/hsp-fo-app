import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import makeStyles from '@material-ui/core/styles/makeStyles'

import { searchSelectors } from 'src/contexts/selectors'
import { toSearchParams } from 'src/utils/searchparams'

const useStyles = makeStyles((theme) => ({
  link: {
    padding: theme.spacing(0.5),
  },
}))

interface NormLinkProps {
  id: string
  className: string
  preferredName: string
  error?: Error
}

export function NormLink(props: Readonly<NormLinkProps>) {
  const { id, className, preferredName, error } = props
  const cls = useStyles()
  const [authParams, setAuthParams] = useState(
    `/authority-files?${toSearchParams({ authorityfileid: id })}`,
  )
  const searchParams = useSelector(searchSelectors.getSearchParams)

  useEffect(() => {
    const newParams = toSearchParams({
      ...searchParams,
      authorityfileid: id,
      hspobjectid: undefined,
    })
    setAuthParams(`/authority-files?${newParams}`)
  }, [searchParams, id])

  if (error) {
    return <div className={clsx(cls.link, className)}>{preferredName}</div>
  }

  return (
    <Link className={clsx(cls.link, className)} to={authParams}>
      {preferredName}
    </Link>
  )
}
