import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import Box from '@material-ui/core/Box'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import MailOutlinedIcon from '@material-ui/icons/MailOutlined'

import { actions } from 'src/contexts/actions/actions'
import { useTranslation } from 'src/contexts/i18n'
import { selectors } from 'src/contexts/selectors'

import { LocaleSwitch } from './LocaleSwitch'

const useStyles = makeStyles((theme) => ({
  feedbackIcon: {
    paddingLeft: '0',
    paddingRight: '0',
    color: theme.palette.primary.main,
    '&:focus-visible': {
      outlineOffset: theme.spacing(-0.5),
    },
  },
  withLabelBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  caption: {
    fontSize: '10px',
  },
  listItemIcon: { justifyContent: 'center' },
  listItemText: { paddingLeft: '8px' },
}))

interface Props {
  mobile: boolean
}

export function GlobalTools(props: Readonly<Props>) {
  const dispatch = useDispatch()
  const cls = useStyles()
  const { t } = useTranslation()
  const sideBarOpen = useSelector(selectors.getSidebarOpen)

  return (
    <List component="div" role="toolbar" aria-orientation="vertical">
      <LocaleSwitch sideBarOpen={sideBarOpen} mobile={props.mobile} />
      <ListItem
        className={cls.feedbackIcon}
        button={true}
        component={Link}
        to={t('links.feedback')}
        onClick={() => props.mobile && dispatch(actions.toggleSidebar())}
      >
        <ListItemIcon className={cls.listItemIcon}>
          <Box className={cls.withLabelBox}>
            <MailOutlinedIcon className={cls.feedbackIcon} aria-hidden={true} />
            <Typography className={cls.caption} variant="caption">
              {!sideBarOpen && t('sidebar.tools.feedback')}
            </Typography>
          </Box>
        </ListItemIcon>
        <ListItemText className={cls.listItemText}>
          <Typography variant="subtitle1">
            {t('sidebar.tools.feedback')}
          </Typography>
        </ListItemText>
      </ListItem>
    </List>
  )
}
