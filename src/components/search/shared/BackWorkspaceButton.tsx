import React from 'react'
import { Link } from 'react-router-dom'

import Button from '@material-ui/core/Button'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import { useSearchTranslation } from '../utils'

const useStyles = makeStyles((theme) => ({
  backButton: {
    [theme.breakpoints.up('md')]: {
      marginRight: theme.spacing(3),
      marginLeft: theme.spacing(2),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      textWrap: 'nowrap',
    },
    [theme.breakpoints.down('sm')]: { textWrap: 'pretty' },
  },
}))

export default function BackWorkspaceButton() {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true })
  const { searchT } = useSearchTranslation()

  const cls = useStyles()
  const text = mobile
    ? searchT('overview', 'buttonBackToWorkspaceMobile')
    : searchT('overview', 'buttonBackToWorkspaceDesktop')
  return (
    <Button
      className={cls.backButton}
      startIcon={
        <img
          src={`/img/workspace.svg`}
          aria-hidden={true}
          alt={searchT('overview', 'buttonBackToWorkspaceDesktop')}
        />
      }
      component={Link}
      to={'/workspace'}
    >
      {text}
    </Button>
  )
}
