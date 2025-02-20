import clsx from 'clsx'
import React from 'react'

import Button from '@material-ui/core/Button'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import ChromeReaderModeRoundedIcon from '@material-ui/icons/ChromeReaderModeRounded'

import { useSearchTranslation } from 'src/components/search/utils'
import { ShareLink } from 'src/components/shared/ShareLink'
import { Tooltip } from 'src/utils/Tooltip'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    border: 'none',
  },
  button: {
    paddingRight: theme.spacing(1),
    cursor: 'pointer',

    minWidth: 'auto',
    '&:hover': {
      background: 'inherit',
    },
  },
  color: {
    color: theme.palette.liver.light,
    display: 'flex',
    alignItems: 'center',
  },
  count: {
    marginLeft: theme.spacing(0.25),
  },
  kodInfo: {
    textDecoration: 'none',
    paddingLeft: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
  },
}))

interface Props {
  permalink: string
  numFound: string
}

export function ResourceLinks(props: Readonly<Props>) {
  const { permalink, numFound } = props
  const cls = useStyles()
  const { searchT } = useSearchTranslation()
  const label = searchT('normOverview', 'resourceKodBtn')

  function handleOnClick() {
    const elem = document.getElementById('authorityFileResult')
    elem?.scrollIntoView()
  }

  return (
    <fieldset
      className={clsx(cls.root)}
      aria-label={searchT('normOverview', 'resourceLinks')}
    >
      {permalink && <ShareLink permalink={permalink} />}
      <Button onClick={() => handleOnClick()}>
        <Tooltip title={label}>
          <ListItemIcon
            className={clsx(cls.button, cls.color)}
            aria-label={label}
          >
            <ChromeReaderModeRoundedIcon />
            <Typography className={clsx(cls.color, cls.count)} component="span">
              {numFound}
            </Typography>
          </ListItemIcon>
        </Tooltip>
      </Button>
    </fieldset>
  )
}
