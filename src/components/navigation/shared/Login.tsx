import { makeStyles } from 'tss-react/mui'

import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import PermIdentityIcon from '@mui/icons-material/PermIdentity'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import { useKeycloak } from 'src/contexts/Keycloak'

const useStyles = makeStyles()((theme) => ({
  auth: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}))
export function Login() {
  const { classes: cls } = useStyles()
  const { keycloak } = useKeycloak()
  const isAuthenticated = !!keycloak.authenticated

  const handleAuthAction = () =>
    isAuthenticated ? keycloak.logout() : keycloak.login()

  return isAuthenticated ? (
    <Box className={cls.auth}>
      <Typography>{keycloak.tokenParsed?.displayName}</Typography>
      <IconButton onClick={handleAuthAction} size="large">
        <ExitToAppIcon />
      </IconButton>
    </Box>
  ) : (
    <IconButton onClick={handleAuthAction} size="large">
      <PermIdentityIcon />
    </IconButton>
  )
}
