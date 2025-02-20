import clsx from 'clsx'
import React from 'react'
import { Link } from 'react-router-dom'

import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'

import { useTranslation } from 'src/contexts/i18n'
import { AcfProject } from 'src/contexts/wordpress'

import { Grid } from '../../shared/Grid'
import Table from './Table'

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  title: {
    [theme.breakpoints.down('xs')]: {
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
    },
  },
  headline: {
    marginRight: theme.spacing(2),
  },
  button: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    marginTop: theme.spacing(1),
    background: theme.palette.background.default,
    whiteSpace: 'nowrap',
    float: 'right',
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(2),
      float: 'none',
    },
  },
  status: {
    marginTop: theme.spacing(2),
  },
}))

interface Props {
  className?: string
  project: AcfProject
}

export function Overview(props: Readonly<Props>) {
  const { project, className } = props
  const cls = useStyles()
  const { t } = useTranslation()

  return (
    <div className={clsx(cls.root, className)}>
      <Grid>
        <Typography variant="h1" color="inherit" className={cls.title}>
          {project.projectName}
          <Button
            component={Link}
            to={`/projects`}
            tabIndex={0}
            className={cls.button}
            variant="outlined"
            size="small"
            startIcon={<ArrowBackIcon />}
            aria-label={t('projects.back')}
          >
            {t('projects.back')}
          </Button>
          <Typography variant="body2" className={cls.status}>
            {project.status ? t('projects.running') : t('projects.finished')}
          </Typography>
        </Typography>
        <Table project={project} />
      </Grid>
    </div>
  )
}
