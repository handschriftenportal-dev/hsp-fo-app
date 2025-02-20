import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import MuiGrid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/core/styles/makeStyles'

import { useSetMetatag } from 'src/contexts/Metatags'

const useStyles = makeStyles((theme) => ({
  body: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing(1),
    minWidth: 200,
  },
  errorPage: {
    display: 'flex',
    flexShrink: 0,
    maxWidth: 500,
  },
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    [theme.breakpoints.only('xs')]: {
      marginTop: theme.spacing(2),
    },
  },
}))
interface ErrorPageProps {
  id?: string
}

export function ErrorPage(props: Readonly<ErrorPageProps>) {
  const { id } = props
  const cls = useStyles()
  const { t } = useTranslation()
  useSetMetatag({ key: 'name', value: 'robots', content: 'noindex' })

  return (
    <div className={cls.root}>
      <MuiGrid container justifyContent="center">
        <MuiGrid item xs={4} className={cls.errorPage} id="errorPage">
          <img alt={t('errorPage.failed')} src="/img/errorPage_settings.svg" />
          <div className={cls.content}>
            <Typography variant="h1">{t('errorPage.failed')}</Typography>
            <div className={cls.body}>
              <Typography variant="body1">
                <Trans
                  i18nKey={'errorPage.failedMsg'}
                  components={{
                    Link: (
                      <Link href={`mailto:${t('errorPage.serviceMail')}`} />
                    ),
                  }}
                />
              </Typography>
            </div>
            <Link component={RouterLink} to="/">
              {t('errorPage.backToHome')}
            </Link>
          </div>
        </MuiGrid>
      </MuiGrid>
    </div>
  )
}
