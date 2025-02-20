import React from 'react'
import { useLocation } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'

import { useTranslation } from 'src/contexts/i18n'
import { useGetLocationType } from 'src/utils/useGetLocationType'
import { useLoadingSnackbar } from 'src/utils/useLoadingSnackbar'

import { ActiveFilters } from '../Filter/ActiveFilters'
import { Tools } from '../Tools'
import { Paging } from '../Tools/Paging'
import { Hits } from './ResultHits'

const useStyles = makeStyles((theme) => ({
  marginTop: {
    marginTop: theme.spacing(10),
  },
  activeFilters: {
    marginTop: theme.spacing(3),
  },
  tools: {
    marginTop: theme.spacing(4),
  },
  hits: {
    marginTop: theme.spacing(3),
  },
}))

export function ViewContent({
  isSuspense,
}: Readonly<{ isSuspense?: boolean }>) {
  const cls = useStyles()
  const locationType = useGetLocationType()

  const location = useLocation()
  const { t } = useTranslation()

  const title = location.pathname.includes('search')
    ? t(`sidebar.pages.search`)
    : t(`sidebar.pages.catalogs`)
  useLoadingSnackbar(title, isSuspense)

  return (
    <>
      <div className={cls.marginTop}>
        {locationType === 'objects' && (
          <div className={cls.activeFilters}>
            <ActiveFilters />
          </div>
        )}
        <Tools className={cls.tools} />
      </div>
      <Hits className={cls.hits} />
      <Paging isBottom />
    </>
  )
}
