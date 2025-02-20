import { useKeycloak } from '@react-keycloak/web'
import React from 'react'

import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/core/styles/makeStyles'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import PermIdentityIcon from '@material-ui/icons/PermIdentity'

const useStyles = makeStyles((theme) => ({
  auth: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}))
export function Login() {
  const cls = useStyles()
  const { keycloak } = useKeycloak()
  const isAuthenticated = !!keycloak.authenticated

  const handleAuthAction = () =>
    isAuthenticated ? keycloak.logout() : keycloak.login()

  return isAuthenticated ? (
    <Box className={cls.auth}>
      <Typography>{keycloak.tokenParsed?.displayName}</Typography>
      <IconButton onClick={handleAuthAction}>
        <ExitToAppIcon />
      </IconButton>
    </Box>
  ) : (
    <IconButton onClick={handleAuthAction}>
      <PermIdentityIcon />
    </IconButton>
  )
}
