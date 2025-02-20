import React from 'react'

import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  imgDiv: {
    position: 'relative',
    height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,
    [theme.breakpoints.down('xs')]: {
      height: 'calc(100vh - 76px)',
    },
  },
  imgDivMobile: {
    position: 'relative',
    height: 'var(--hsp-home-carousel-height)',
  },
  carouselImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  descriptionDiv: {
    position: 'absolute',
    zIndex: 1,
    bottom: '4%',
    padding: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      maxWidth: '45%',
      left: theme.spacing(1.5),
      paddingLeft: theme.spacing(1),
    },
  },
  imageInfo: {
    background: 'rgba(255, 255, 255, 0.7)',
    padding: theme.spacing(1),
    display: 'table',
    opacity: '0.9',
  },
  imageIdent: {
    background: 'rgba(255, 255, 255, 0.7)',
    padding: theme.spacing(1),
    marginTop: theme.spacing(2),
    display: 'table',
    opacity: '0.9',
    [theme.breakpoints.down('sm')]: {
      marginRight: theme.spacing(2),
    },
  },
}))

interface Props {
  url: string
  ident: string
  info: string
  isOnMobile: boolean
}

export function Image(props: Readonly<Props>) {
  const { url, ident, info, isOnMobile } = props
  const classes = useStyles()

  return (
    <div className={isOnMobile ? classes.imgDivMobile : classes.imgDiv}>
      <img className={classes.carouselImg} src={url} alt={info} />
      <div className={classes.descriptionDiv}>
        <Typography className={classes.imageInfo}>{info}</Typography>
        <Typography className={classes.imageIdent}>{ident}</Typography>
      </div>
    </div>
  )
}
