import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { makeStyles } from 'tss-react/mui'

import Grid from '@mui/material/GridLegacy'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'

import { getProjects } from 'src/components/projects/utils/projectsUtils'
import { actions } from 'src/contexts/actions/actions'
import { useTranslation } from 'src/contexts/i18n'
import { AcfProject } from 'src/contexts/wordpress'

import { FlipCard } from './FlipCard'

const useStyles = makeStyles()((theme) => ({
  root: {},
  headline: {
    margin: theme.spacing(4),
  },
  buttonRow: {
    [theme.breakpoints.up('sm')]: {
      float: 'right',
    },
    [theme.breakpoints.down('sm')]: {
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
  const { classes: cls } = useStyles()
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
        {t('projects.title')}
        <div className={cls.buttonRow}>
          <ToggleButtonGroup
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
