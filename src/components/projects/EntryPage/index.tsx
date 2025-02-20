import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'

import { getProjects } from 'src/components/projects/utils/projectsUtils'
import { actions } from 'src/contexts/actions/actions'
import { useTranslation } from 'src/contexts/i18n'
import { AcfProject } from 'src/contexts/wordpress'

import { FlipCard } from './FlipCard'

const useStyles = makeStyles((theme) => ({
  root: {},
  headline: {
    margin: theme.spacing(4),
  },
  buttonRow: {
    [theme.breakpoints.up('sm')]: {
      float: 'right',
    },
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(2),
    },
  },
}))

interface Props {
  className?: string
  projects: AcfProject[]
  projectStatus: string
}

export function EntryPage(props: Readonly<Props>) {
  const cls = useStyles()
  const { t } = useTranslation()
  const { className, projects, projectStatus } = props
  const dispatch = useDispatch()

  const [filteredProjects, setFilteredProjects] = useState<AcfProject[]>()

  const filterProjects = (status: string) => {
    setFilteredProjects(getProjects(projects, status))
    dispatch(actions.setProjectStatus(status))
  }

  const handleChange = (_event: unknown, status: string) => {
    filterProjects(status)
  }

  useEffect(() => {
    filterProjects(projectStatus)
  }, [])

  return (
    <div className={clsx(cls.root, className)}>
      <Typography className={cls.headline} variant="h2">
        Digitalisierungs- und Erschließungsprojekte
        <div className={cls.buttonRow}>
          <ToggleButtonGroup
            color="primary"
            size="small"
            value={projectStatus}
            exclusive
            onChange={handleChange}
          >
            <ToggleButton value="finished">
              {t('projects.finished')}
            </ToggleButton>
            <ToggleButton value="all">{t('projects.all')}</ToggleButton>
            <ToggleButton value="running">{t('projects.running')}</ToggleButton>
          </ToggleButtonGroup>
        </div>
      </Typography>
      {filteredProjects && (
        <Grid container justifyContent="center">
          {filteredProjects.map((project: AcfProject) => {
            return <FlipCard project={project} key={project.id} />
          })}
        </Grid>
      )}
    </div>
  )
}
