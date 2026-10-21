import clsx from 'clsx'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router'
import { makeStyles } from 'tss-react/mui'

import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CloseIcon from '@mui/icons-material/Close'
import { Typography } from '@mui/material'
import Alert from '@mui/material/Alert'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'

import { Grid } from 'src/components/shared/Grid'
import { actions } from 'src/contexts/actions/actions'
import { catalogActions } from 'src/contexts/actions/catalogActions'
import { catalogSelectors, selectors } from 'src/contexts/selectors'

const useStyles = makeStyles()((theme) => ({
  alert: {
    backgroundColor: theme.palette.whiteSmoke.main,
    color: theme.palette.black.main,
  },
  grid: {
    paddingTop: theme.spacing(4),
  },
  link: {
    alignItems: 'center',
    color: theme.palette.primary.main,
    display: 'inline-flex',
  },
}))

export default function CatalogNotification() {
  const { classes: cls } = useStyles()

  const dispatch = useDispatch()

  const sideBarOpen = useSelector(selectors.getSidebarOpen)
  const notificationOpen = useSelector(
    catalogSelectors.getCatalogNotificationOpen,
  )

  const handleClick = () => {
    if (!sideBarOpen) {
      dispatch(actions.toggleSidebar())
    }
  }

  return (
    <Grid className={cls.grid}>
      <Collapse in={notificationOpen}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                dispatch(catalogActions.toggleNotification())
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          className={cls.alert}
          icon={false}
        >
          <Typography variant="body1">
            <Trans
              i18nKey={'catalog.notificationText'}
              components={{
                Link: (
                  <Link
                    to={'/info/content'}
                    className={clsx(cls.link, 'addFocusableWithOutline')}
                    onClick={handleClick}
                  />
                ),
                Icon: <ArrowForwardIcon fontSize="small" />,
              }}
            />
          </Typography>
        </Alert>
      </Collapse>
    </Grid>
  )
}
