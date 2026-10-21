import { makeStyles } from 'tss-react/mui'

import Box from '@mui/material/Box'

import { SocialLinkIcon } from './SocialLinkIcon'

const useStyles = makeStyles()((theme) => ({
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
  const { classes: cls } = useStyles()

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
