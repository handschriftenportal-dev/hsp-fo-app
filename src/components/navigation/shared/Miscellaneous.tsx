import clsx from 'clsx'
import React from 'react'
import { Link } from 'react-router-dom'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import { makeStyles } from '@material-ui/core/styles'

import { useTranslation } from 'src/contexts/i18n'

const useStyles = makeStyles((theme) => ({
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
  const cls = useStyles()
  const { t } = useTranslation()

  return (
    <List className={className} component="nav">
      <ListItem
        button={true}
        className={clsx(cls.link, 'addFocusableWithWhiteOutline')}
        component={Link}
        tabIndex={0}
        to={t('links.legal')}
      >
        {t('sidebar.misc.legal')}
      </ListItem>
      <ListItem
        button={true}
        className={clsx(cls.link, 'addFocusableWithWhiteOutline')}
        component={Link}
        to={t('links.accessibility')}
        id="accessibility"
        tabIndex={0}
      >
        {t('sidebar.misc.accessibility')}
      </ListItem>
    </List>
  )
}
