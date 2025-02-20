import clsx from 'clsx'
import NukaCarousel from 'nuka-carousel'
import React from 'react'
import { useTranslation } from 'react-i18next'

import Button from '@material-ui/core/Button'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Typography from '@material-ui/core/Typography'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'

import {
  ImageSet,
  replaceImageUrl,
} from 'src/components/projects/utils/projectsUtils'

const useStyles = makeStyles((theme) => ({
  carousel: {
    width: '25%',
    float: 'right',
  },
  img: {
    height: '100%',
    width: '100%',
    objectFit: 'cover',
  },
  imgInfo: {
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      wordWrap: 'break-word',
    },
  },
  icon: {
    background: 'rgba(255, 255, 255, 0.7)',
    paddingLeft: theme.spacing(0.5),
    paddingBottom: theme.spacing(1.5),
    paddingTop: theme.spacing(1.5),
    width: theme.spacing(3.5),
    height: theme.spacing(6),
  },
  itemIcon: {
    display: 'inline',
    cursor: 'pointer',
    opacity: '0.5',
  },
  itemIconOut: {
    cursor: 'not-allowed',
    opacity: '0.1',
  },
  button: {
    background: 'transparent',
    border: 'none',
    padding: 'unset',
    minWidth: 'unset',
    display: 'unset',
  },
}))

interface Props {
  imageSet: ImageSet[]
  kodLink?: string
}

export function ImgCarousel(props: Readonly<Props>) {
  const cls = useStyles()
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('xs'), { noSsr: true })
  const { imageSet } = props
  const { t } = useTranslation()

  const renderIcon = (icon: string) => {
    return (
      <div className={cls.icon}>
        {icon === 'previous' && <ArrowBackIosIcon />}
        {icon === 'next' && <ArrowForwardIosIcon />}
      </div>
    )
  }
  const renderButton = (
    slide: () => void,
    direction: string,
    enabled: boolean,
  ) => {
    if (mobile) {
      return null
    }
    return (
      <Button
        className={cls.button}
        onClick={slide}
        aria-label={t('projects', direction)}
        tabIndex={enabled ? 0 : -1}
      >
        <ListItemIcon
          className={clsx(cls.itemIcon, { [cls.itemIconOut]: !enabled })}
        >
          {renderIcon(direction)}
        </ListItemIcon>
      </Button>
    )
  }

  return (
    <div className={cls.carousel}>
      <NukaCarousel
        slidesToScroll={1}
        renderCenterLeftControls={({ previousSlide, currentSlide }) =>
          renderButton(previousSlide, 'previous', currentSlide > 0)
        }
        renderCenterRightControls={({ nextSlide, currentSlide, slideCount }) =>
          renderButton(nextSlide, 'next', currentSlide < slideCount - 1)
        }
        withoutControls={mobile}
        renderBottomCenterControls={null}
      >
        {imageSet.map((set: ImageSet) => {
          return (
            <div key={set.img}>
              <img
                className={cls.img}
                src={replaceImageUrl(set.img)}
                alt={set.imgInfo}
              />
              <Typography className={cls.imgInfo}>{set.imgInfo}</Typography>
            </div>
          )
        })}
      </NukaCarousel>
    </div>
  )
}
