import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import { searchActions } from 'src/contexts/actions/searchActions'
import { useFetchExtFieldInfo } from 'src/contexts/discovery'
import { extSearchSelectors } from 'src/contexts/selectors'

import { MobileNavigation } from './mobile'
import { WebNavigation } from './web'

interface Props {
  Outlet: React.ReactElement
}

export function Navigation(props: Readonly<Props>) {
  const theme = useTheme()
  const dispatch = useDispatch()
  const mobile = useMediaQuery(theme.breakpoints.down('xs'), { noSsr: true })

  const extFieldsInfo = useFetchExtFieldInfo()
  const hasFetchedExtFields = useSelector(
    extSearchSelectors.getHasFetchedExtFields,
  )

  useEffect(() => {
    if (!hasFetchedExtFields) {
      dispatch(searchActions.setExtSearchFieldsInfo(extFieldsInfo.extFields))
    }
  }, [extFieldsInfo])

  return mobile ? (
    <MobileNavigation Outlet={props.Outlet} />
  ) : (
    <WebNavigation Outlet={props.Outlet} />
  )
}
