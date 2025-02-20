import React from 'react'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'

import { replaceImageUrl } from 'src/components/projects/utils/projectsUtils'
import { useTranslation } from 'src/contexts/i18n'

export interface CardFrontProps {
  projectTitle: string
  start: string
  end: string
  thumbnail: string
  support?: string
  involvedInstitutions: string
  status?: boolean
  runningTime?: string
  className?: string
  id: string
}

const useStyles = makeStyles((theme) => ({
  arrowIcon: {
    color: theme.palette.primary.main,
    marginLeft: theme.spacing(0.5),
  },
  card: {
    display: 'flex',
    height: '100%',
    width: '100%',
    [theme.breakpoints.down('sm')]: {},
  },
  content: {
    marginRight: theme.spacing(1),
    width: '70%',
  },
  iconDiv: {
    verticalAlign: '-5px',
  },
  img: {
    flexGrow: 0,
    flexShrink: 0,
    width: '30%',
  },
  info: {
    marginTop: theme.spacing(1),
  },
  status: {
    marginBottom: theme.spacing(1),
  },
  title: {
    [theme.breakpoints.up('sm')]: {
      fontSize: '18px',
    },
  },
}))

export function CardFront(props: Readonly<CardFrontProps>) {
  const { t } = useTranslation()
  const cls = useStyles()

  const {
    thumbnail,
    status,
    runningTime,
    support,
    involvedInstitutions,
    projectTitle,
    id,
  } = props

  return (
    <Card raised className={cls.card}>
      <CardContent className={cls.content}>
        <Typography component="p" variant="subtitle2" className={cls.status}>
          Status: {status ? t('projects.running') : t('projects.finished')}
        </Typography>
        <Typography variant="h2" className={cls.title}>
          {projectTitle}
          <ListItemIcon className={cls.iconDiv}>
            <ArrowForwardIcon className={cls.arrowIcon} />
          </ListItemIcon>
        </Typography>
        <Typography component="p" variant="subtitle2">
          {id}
        </Typography>
        <Typography variant="body1" className={cls.info}>
          <strong>{t('projects.table.runningTime')}: </strong> {runningTime}
          <br />
          <strong>{t('projects.table.support')}: </strong> {support} <br />
          <strong>{t('projects.table.involvedInstitutions')}: </strong>
          {involvedInstitutions} <br />
        </Typography>
      </CardContent>
      <CardMedia
        className={cls.img}
        component="img"
        image={replaceImageUrl(thumbnail)}
        alt={`${t('thumbnailFor')} ${projectTitle}`}
      />
    </Card>
  )
}
