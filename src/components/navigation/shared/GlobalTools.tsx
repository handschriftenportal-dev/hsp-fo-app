import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router'
import { makeStyles } from 'tss-react/mui'

import MailOutlinedIcon from '@mui/icons-material/MailOutlined'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'

import { actions } from 'src/contexts/actions/actions'
import { useTranslation } from 'src/contexts/i18n'
import { selectors } from 'src/contexts/selectors'

import { LocaleSwitch } from './LocaleSwitch'

const useStyles = makeStyles()((theme) => ({
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
  listItemIcon: { justifyContent: 'center' },
  listItemText: { paddingLeft: '8px' },
  disable: {
    display: 'none',
  },
}))

interface Props {
  mobile: boolean
}

export function GlobalTools(props: Readonly<Props>) {
  const dispatch = useDispatch()
  const { classes: cls } = useStyles()
  const { t } = useTranslation()
  const sideBarOpen = useSelector(selectors.getSidebarOpen)

  return (
    <List component="div" role="toolbar" aria-orientation="vertical">
      <LocaleSwitch sideBarOpen={sideBarOpen} mobile={props.mobile} />
      <ListItemButton
        className={cls.feedbackIcon}
        component={Link}
        to={t('links.feedback')}
        onClick={() => props.mobile && dispatch(actions.toggleSidebar())}
      >
        <ListItemIcon className={cls.listItemIcon}>
          <Box className={cls.withLabelBox}>
            <MailOutlinedIcon className={cls.feedbackIcon} aria-hidden={true} />
            <Typography variant="caption" sx={{ fontSize: '10px' }}>
              {!sideBarOpen && t('sidebar.tools.feedback')}
            </Typography>
          </Box>
        </ListItemIcon>
        <ListItemText className={sideBarOpen ? cls.listItemText : cls.disable}>
          <Typography variant="subtitle1">
            {t('sidebar.tools.feedback')}
          </Typography>
        </ListItemText>
      </ListItemButton>
    </List>
  )
}
