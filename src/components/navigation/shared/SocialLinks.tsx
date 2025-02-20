import React from 'react'

import Box from '@material-ui/core/Box'
import makeStyles from '@material-ui/core/styles/makeStyles'

import { SocialLinkIcon } from './SocialLinkIcon'

const useStyles = makeStyles((theme) => ({
  newsletterImg: {
    width: theme.spacing(5),
    filter: 'invert(1)',
  },
  mastodonImg: {
    width: theme.spacing(4),
  },
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  x: { width: theme.spacing(4) },
}))

export function SocialLinks() {
  const cls = useStyles()

  return (
    <Box className={cls.root}>
      <SocialLinkIcon
        className={cls.mastodonImg}
        type={'mastodon'}
        src={`/img/mastodon_logo_white.svg`}
      />
      <SocialLinkIcon
        className={cls.x}
        type={'bluesky'}
        src={`/img/bluesky_logo.svg`}
      />
      <SocialLinkIcon
        className={cls.newsletterImg}
        type={'newsletter'}
        src={`/img/mark_email_read.svg`}
      />
    </Box>
  )
}
