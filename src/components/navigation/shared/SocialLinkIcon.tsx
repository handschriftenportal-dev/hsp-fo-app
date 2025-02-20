import clsx from 'clsx'
import React from 'react'

import Link from '@material-ui/core/Link'
import makeStyles from '@material-ui/core/styles/makeStyles'

import { useTranslation } from 'src/contexts/i18n'
import { Tooltip } from 'src/utils/Tooltip'

const useStyles = makeStyles((theme) => ({
  link: {
    padding: theme.spacing(1),
  },
}))

interface LinkIconProps {
  src: string
  className?: string
  type: string
}

export function SocialLinkIcon(props: Readonly<LinkIconProps>) {
  const { type, src, className } = props
  const cls = useStyles()
  const { t } = useTranslation()

  return (
    <Link
      href={t(`socialLinks.link.${type}`)}
      target="blank"
      rel="noreferrer"
      className={clsx('addFocusableWithWhiteOutline', cls.link)}
    >
      <Tooltip title={t(`socialLinks.tooltip.${type}`)}>
        <img className={className} src={src} alt={type} />
      </Tooltip>
    </Link>
  )
}
