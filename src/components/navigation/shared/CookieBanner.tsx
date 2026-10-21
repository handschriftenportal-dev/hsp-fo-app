import { useEffect, useState } from 'react'
import { Trans } from 'react-i18next'
import { makeStyles } from 'tss-react/mui'

import { Box, Button, Link, Paper, Typography } from '@mui/material'

import { useTranslation } from 'src/contexts/i18n'

const useStyles = makeStyles()((theme) => ({
  banner: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    zIndex: 1300,
    padding: theme.spacing(4),
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  },
  textBox: {
    maxWidth: 800,
    lineHeight: 1.6,
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'underline',
  },
  button: {
    marginTop: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      marginTop: 0,
    },
  },
}))

const CookieBanner = () => {
  const { classes: cls } = useStyles()
  const [visible, setVisible] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    const consentGiven = localStorage.getItem('cookieConsent')
    if (!consentGiven) setVisible(true)
  }, [])

  const handleConsent = () => {
    localStorage.setItem('cookieConsent', 'true')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <Paper className={cls.banner} elevation={8}>
      <Box className={cls.content}>
        <Box className={cls.textBox}>
          <Typography variant="h6" gutterBottom>
            {t('cookieBanner.header')}
          </Typography>
          <Trans
            i18nKey="cookieBanner.description"
            components={{
              Link: (
                <Link
                  href={t('cookieBanner.link')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cls.link}
                />
              ),
            }}
          />
        </Box>

        <Button
          className={cls.button}
          color="primary"
          onClick={handleConsent}
          variant="contained"
          aria-label={t('cookieBanner.buttonText')}
        >
          {t('cookieBanner.buttonText')}
        </Button>
      </Box>
    </Paper>
  )
}

export default CookieBanner
