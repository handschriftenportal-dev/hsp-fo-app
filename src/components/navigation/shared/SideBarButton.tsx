import clsx from 'clsx'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from 'tss-react/mui'

import CloseIcon from '@mui/icons-material/Close'
import MenuIcon from '@mui/icons-material/Menu'
import IconButton from '@mui/material/IconButton'

import { actions } from 'src/contexts/actions/actions'
import { useTranslation } from 'src/contexts/i18n'
import { selectors } from 'src/contexts/selectors'
import { Tooltip } from 'src/utils/Tooltip'

const useStyles = makeStyles()((theme) => ({
  icon: {
    [theme.breakpoints.up('sm')]: {
      marginRight: theme.spacing(1),
      marginLeft: theme.spacing(1),
    },
    [theme.breakpoints.only('xs')]: {
      marginRight: theme.spacing(-2),
    },
  },
}))

interface Props {
  className?: string
}

export function SideBarButton(props: Readonly<Props>) {
  const dispatch = useDispatch()
  const sideBarOpen = useSelector(selectors.getSidebarOpen)
  const { t } = useTranslation()
  const { className } = props
  const { classes: cls } = useStyles()

  return (
    <Tooltip
      title={
        sideBarOpen ? t('topBar.collapseSidebar') : t('topBar.expandSidebar')
      }
    >
      <IconButton
        id="sideBarMenu"
        aria-label={
          sideBarOpen ? t('topBar.collapseSidebar') : t('topBar.expandSidebar')
        }
        className={clsx(className, cls.icon)}
        onClick={() => dispatch(actions.toggleSidebar())}
        size="large"
      >
        {sideBarOpen ? <CloseIcon /> : <MenuIcon />}
      </IconButton>
    </Tooltip>
  )
}
