import clsx from 'clsx'
import React from 'react'

import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import { getPublications } from 'src/components/projects/utils/projectsUtils'
import { useTranslation } from 'src/contexts/i18n'
import { AcfProject } from 'src/contexts/wordpress'

import { Grid } from '../../shared/Grid'

const useStyles = makeStyles((theme) => ({
  root: {
    background: 'black',
    color: 'white',
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
}))

interface Props {
  project: AcfProject
  className?: string
}

export function Publications(props: Readonly<Props>) {
  const cls = useStyles()
  const { t } = useTranslation()
  const { project, className } = props
  const publication = getPublications(project.publications)

  if (publication.length) {
    return (
      <div className={clsx(cls.root, className)}>
        <Grid>
          <Typography variant="h2" color="inherit">
            {t('projects.detailPage.publications')}
          </Typography>
          <ul className={cls.text}>
            {publication.map((publicationEntry) => {
              return <li key={publicationEntry}>{publicationEntry}</li>
            })}
          </ul>
        </Grid>
      </div>
    )
  } else {
    return null
  }
}
