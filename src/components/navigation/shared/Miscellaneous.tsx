import clsx from 'clsx'
import { Link } from 'react-router'
import { makeStyles } from 'tss-react/mui'

import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'

import { useTranslation } from 'src/contexts/i18n'

const useStyles = makeStyles()((theme) => ({
  link: {
    color: theme.palette.whiteSmoke.main,
    padding: 0,
    justifyContent: 'center',
  },
}))

interface Props {
  className?: string
}

export function Miscellaneous({ className }: Readonly<Props>) {
  const { classes: cls } = useStyles()
  const { t } = useTranslation()

  return (
    <List className={className} component="nav">
      <ListItemButton
        className={clsx(cls.link, 'addFocusableWithWhiteOutline')}
        component={Link}
        tabIndex={0}
        to={t('links.legal')}
      >
        {t('sidebar.misc.legal')}
      </ListItemButton>
      <ListItemButton
        className={clsx(cls.link, 'addFocusableWithWhiteOutline')}
        component={Link}
        to={t('links.accessibility')}
        id="accessibility"
        tabIndex={0}
      >
        {t('sidebar.misc.accessibility')}
      </ListItemButton>
    </List>
  )
}
