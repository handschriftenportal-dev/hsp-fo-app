import React from 'react'
import { Link } from 'react-router-dom'

import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import { useTranslation } from 'src/contexts/i18n'

export interface CardBackProps {
  descriptionShort: string
  flip: boolean
  id: string
}

const useStyles = makeStyles((theme) => ({
  btn: {
    margin: theme.spacing(1),
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    height: '100%',
    width: '100%',
  },
  shortDesc: {
    margin: theme.spacing(1),
  },
}))

export function CardBack(props: Readonly<CardBackProps>) {
  const { t } = useTranslation()
  const cls = useStyles()
  const { descriptionShort, flip, id } = props

  return (
    <Card raised className={cls.card}>
      <CardContent>
        <Typography className={cls.shortDesc} variant="body1">
          {descriptionShort}
        </Typography>
        <CardActions onClick={(e) => e.stopPropagation()} className={cls.btn}>
          <Button
            variant="outlined"
            size="small"
            component={Link}
            to={`/projects?projectid=${id}`}
            tabIndex={flip ? 0 : -1}
          >
            {t('projects.more')}
          </Button>
        </CardActions>
      </CardContent>
    </Card>
  )
}
