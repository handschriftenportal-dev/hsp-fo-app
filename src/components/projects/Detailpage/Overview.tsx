import clsx from 'clsx'
import { Link } from 'react-router'
import { makeStyles } from 'tss-react/mui'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import { useTranslation } from 'src/contexts/i18n'
import { AcfProject } from 'src/contexts/wordpress'

import { Grid } from '../../shared/Grid'
import Table from './Table'

const useStyles = makeStyles()((theme) => ({
  root: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  title: {
    [theme.breakpoints.down('sm')]: {
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
    [theme.breakpoints.down('sm')]: {
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
  const { classes: cls } = useStyles()
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
