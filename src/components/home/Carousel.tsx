import clsx from 'clsx'
import NukaCarousel from 'nuka-carousel'
import React, { useEffect } from 'react'
import { useLoaderData } from 'react-router-dom'

import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'

import { useTranslation } from 'src/contexts/i18n'
import { HomeLoaderDataProps } from 'src/contexts/loader'

import { Image } from './Image'

const useStyles = makeStyles((theme) => ({
  rootWeb: {
    gridRowStart: 1,
    gridColumnStart: 1,
  },
  rootMobile: {
    height: 'inherit',
  },
  icon: {
    background: 'rgba(255, 255, 255, 0.7)',
    paddingLeft: theme.spacing(0.5),
    paddingBottom: theme.spacing(1.5),
    paddingTop: theme.spacing(1.5),
    width: theme.spacing(3.5),
    height: theme.spacing(6),
  },
  bottomCenterActive: {
    fill: theme.palette.primary.main + '!important',
  },
  bottomCenterButton: {
    opacity: 1,
    background: 'transparent',
    border: 'none',
    fill: 'white',
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
    minWidth: 0,
  },
  bottomCenterList: {
    position: 'relative',
    top: theme.spacing(-2),
    display: 'flex',
    padding: '0px',
    marginBottom: theme.spacing(2),
    [theme.breakpoints.only('xs')]: {
      marginBottom: theme.spacing(1),
      top: 0,
    },
  },
  bottomCenterListItem: {
    padding: 0,
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
  loading: {
    position: 'absolute',
  },
  button: {
    background: 'transparent',
    border: 'none',
    padding: 'unset',
    minWidth: 'unset',
    display: 'unset',
  },
}))

export function Carousel() {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('xs'), { noSsr: true })
  const { imageSets, error } = useLoaderData() as HomeLoaderDataProps
  const { t } = useTranslation()
  const cls = useStyles()

  const isOnMobile = window.matchMedia('(pointer:coarse)').matches && mobile

  useEffect(() => {
    if (isOnMobile && imageSets) {
      const elem = document.getElementById('hsp-home-main')
      if (elem) {
        const carouselHeight = elem.getBoundingClientRect().height
        document.documentElement.style.setProperty(
          `--hsp-home-carousel-height`,
          `${carouselHeight}px`,
        )
      }
    }
  })
  if (error || !imageSets) {
    return (
      <p className={cls.loading}>
        {error ? t('home.loadingError') : t('home.loading')}
      </p>
    )
  }

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
        aria-label={t('home.' + direction)}
      >
        <ListItemIcon
          className={clsx(cls.itemIcon, { [cls.itemIconOut]: !enabled })}
        >
          {renderIcon(direction)}
        </ListItemIcon>
      </Button>
    )
  }

  const renderPagingDots = (
    slideCount: number,
    currentSlide: number,
    goToSlide: (targetIndex: number) => void,
  ) => {
    return (
      <div>
        <List
          aria-label={t('home.carouselDotLabel')}
          role="listbox"
          component="nav"
          className={cls.bottomCenterList}
          id="gallery"
          tabIndex={-1}
        >
          {Object.keys([...Array(slideCount)])
            .map(parseFloat)
            .map((key: number) => (
              <Button
                aria-selected={currentSlide === key}
                role="option"
                key={`carousel-paging-dot-${key}`}
                type="button"
                aria-label={`${t('home.image')} ${key}`}
                onClick={() => goToSlide(key)}
                className={cls.bottomCenterButton}
              >
                <svg
                  className={
                    currentSlide === key ? cls.bottomCenterActive : undefined
                  }
                  width="6"
                  height="6"
                  aria-hidden="true"
                  focusable="false"
                  viewBox="0 0 6 6"
                >
                  <circle cx="3" cy="3" r="3" />
                </svg>
              </Button>
            ))}
        </List>
      </div>
    )
  }

  return (
    <div
      data-testid="home-carousel"
      className={mobile ? cls.rootMobile : cls.rootWeb}
    >
      <NukaCarousel
        slidesToScroll={1}
        style={
          isOnMobile
            ? {
                height: 'var(--hsp-home-carousel-height)',
              }
            : { lineHeight: '0%' }
        }
        renderBottomCenterControls={({ slideCount, currentSlide, goToSlide }) =>
          renderPagingDots(slideCount, currentSlide, goToSlide)
        }
        renderCenterLeftControls={({ previousSlide, currentSlide }) =>
          renderButton(previousSlide, 'previous', currentSlide > 0)
        }
        renderCenterRightControls={({ nextSlide, currentSlide, slideCount }) =>
          renderButton(nextSlide, 'next', currentSlide < slideCount - 1)
        }
      >
        {imageSets.map((set) => (
          <Image {...set} key={set.url} isOnMobile={isOnMobile} />
        ))}
      </NukaCarousel>
    </div>
  )
}
