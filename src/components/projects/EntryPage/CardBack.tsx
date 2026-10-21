import { Link } from 'react-router'
import { makeStyles } from 'tss-react/mui'

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

import { useTranslation } from 'src/contexts/i18n'

export interface CardBackProps {
  descriptionShort: string
  flip: boolean
  id: string
}

const useStyles = makeStyles()((theme) => ({
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
  const { classes: cls } = useStyles()
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
