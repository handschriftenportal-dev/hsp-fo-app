import React from 'react'

import Link from '@material-ui/core/Link'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/core/styles/makeStyles'

import { useSearchTranslation } from 'src/components/search/utils'

const useStyles = makeStyles((theme) => ({
  bold: { fontWeight: 'bold' },
  link: {
    color: 'inherit',
  },
  linkTypo: {
    '&:focus-within': {
      outline: `${theme.spacing(0.5)}px solid ${theme.palette.white.main}`,
    },
  },
  marginTop: {
    marginTop: theme.spacing(2),
  },
  tooltip: {
    maxWidth: 450,
  },
}))

export interface DigiExternalProps {
  href: string
}

export function DigiExternal(props: Readonly<DigiExternalProps>) {
  const { searchT } = useSearchTranslation()
  const cls = useStyles()
  const { href } = props

  return (
    <div className={cls.marginTop}>
      <Typography color="inherit" className={cls.bold}>
        {searchT('data', 'extPrasentation')}
      </Typography>
      <Tooltip
        title={searchT('resources', 'openDigitalImagesExternal')}
        className={cls.tooltip}
      >
        <Typography
          variant="body1"
          color="inherit"
          noWrap
          className={cls.linkTypo}
        >
          <Link
            className={cls.link}
            target="_blank"
            href={href}
            rel="noreferrer"
          >
            {href}
          </Link>
        </Typography>
      </Tooltip>
    </div>
  )
}
