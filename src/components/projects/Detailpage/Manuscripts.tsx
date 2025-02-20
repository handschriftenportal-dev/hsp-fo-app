import clsx from 'clsx'
import React, { useState } from 'react'

import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { useTranslation } from 'src/contexts/i18n'
import { AcfProject } from 'src/contexts/wordpress'
import { Tooltip } from 'src/utils/Tooltip'

import { Grid } from '../../shared/Grid'
import { HtmlRenderer } from './HtmlRenderer'

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
    [theme.breakpoints.only('xs')]: {
      paddingLeft: theme.spacing(3.5),
      paddingRight: theme.spacing(3.5),
    },
  },
  text: {
    marginLeft: theme.spacing(3),
    marginTop: theme.spacing(3),
    whiteSpace: 'pre-line',
  },
  iconBtn: {},
}))

interface Props {
  className?: string
  project: AcfProject
}

export function Manuscripts(props: Readonly<Props>) {
  const { className, project } = props
  const cls = useStyles()
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  function toggle() {
    setOpen(!open)
  }
  if (project.manuscriptListing) {
    return (
      <div className={clsx(cls.root, className)}>
        <Grid>
          <Typography variant="h2" color="inherit">
            {t('projects.detailPage.manuscriptListing')}
            <IconButton
              className={cls.iconBtn}
              onClick={toggle}
              aria-label={open ? t('projects.close') : t('projects.open')}
            >
              {open ? (
                <Tooltip title={t('projects.close')}>
                  <ExpandLessIcon />
                </Tooltip>
              ) : (
                <Tooltip title={t('projects.show')}>
                  <ExpandMoreIcon />
                </Tooltip>
              )}
            </IconButton>
          </Typography>
          <Collapse in={open}>
            <Typography className={cls.text} variant="body1">
              <HtmlRenderer html={project.manuscriptListing || ''} />
            </Typography>
          </Collapse>
        </Grid>
      </div>
    )
  } else {
    return null
  }
}
