import { Link } from 'react-router'
import { makeStyles } from 'tss-react/mui'

import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import { useSearchTranslation } from '../utils'

const useStyles = makeStyles()((theme) => ({
  backButton: {
    [theme.breakpoints.up('md')]: {
      marginRight: theme.spacing(3),
      marginLeft: theme.spacing(2),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      textWrap: 'nowrap',
    },
    [theme.breakpoints.down('md')]: { textWrap: 'pretty' },
  },
}))

export default function BackWorkspaceButton() {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true })
  const { searchT } = useSearchTranslation()

  const { classes: cls } = useStyles()
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
