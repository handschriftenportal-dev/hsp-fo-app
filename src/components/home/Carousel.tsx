import clsx from 'clsx'
import { useEffect } from 'react'
import { useLoaderData } from 'react-router'
import { makeStyles } from 'tss-react/mui'

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItemIcon from '@mui/material/ListItemIcon'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import { useEmblaControls } from 'src/components/shared/useEmblaControls'
import { useTranslation } from 'src/contexts/i18n'
import { HomeLoaderDataProps } from 'src/contexts/loader'

import { Image } from './Image'

const useStyles = makeStyles()((theme) => ({
  rootWeb: {
    position: 'relative',
    gridRowStart: 1,
    gridColumnStart: 1,
  },
  rootMobile: {
    position: 'relative',
    height: 'inherit',
  },
  viewport: { overflow: 'hidden' },
  container: { display: 'flex', touchAction: 'pan-y pinch-zoom' },
  slide: { flex: '0 0 100%', minWidth: 0 },
  arrowPrev: {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 1,
  },
  arrowNext: {
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 1,
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
    padding: `${theme.spacing(0.5)} ${theme.spacing(1)}`,
    minWidth: 0,
  },
  bottomCenterList: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: theme.spacing(0.5),
    justifyContent: 'center',
    zIndex: 1,
    display: 'flex',
    padding: '0px',
    margin: 0,
    [theme.breakpoints.only('xs')]: {
      bottom: theme.spacing(1),
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
  const mobile = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true })
  const { imageSets, error } = useLoaderData() as HomeLoaderDataProps
  const { t } = useTranslation()
  const { classes: cls } = useStyles()

  const isOnMobile = window.matchMedia('(pointer:coarse)').matches && mobile

  const {
    emblaRef,
    selectedIndex,
    snapCount,
    canPrev,
    canNext,
    scrollPrev,
    scrollNext,
    scrollTo,
  } = useEmblaControls()

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

  const ArrowButton = ({ direction }: { direction: 'previous' | 'next' }) => {
    if (mobile) return null
    const enabled = direction === 'previous' ? canPrev : canNext
    const onClick = direction === 'previous' ? scrollPrev : scrollNext
    return (
      <Button
        className={clsx(cls.button, {
          [cls.arrowPrev]: direction === 'previous',
          [cls.arrowNext]: direction === 'next',
        })}
        onClick={onClick}
        disabled={!enabled}
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

  const PagingDots = () => (
    <List
      aria-label={t('home.carouselDotLabel')}
      role="listbox"
      className={cls.bottomCenterList}
      id="gallery"
      tabIndex={-1}
    >
      {Array.from({ length: snapCount }, (_, key) => (
        <Button
          aria-selected={selectedIndex === key}
          role="option"
          key={`carousel-paging-dot-${key}`}
          type="button"
          aria-label={`${t('home.image')} ${key}`}
          onClick={() => scrollTo(key)}
          className={cls.bottomCenterButton}
        >
          <svg
            className={
              selectedIndex === key ? cls.bottomCenterActive : undefined
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
  )

  return (
    <div
      data-testid="home-carousel"
      className={mobile ? cls.rootMobile : cls.rootWeb}
      style={
        isOnMobile
          ? { height: 'var(--hsp-home-carousel-height)' }
          : { lineHeight: '0%' }
      }
    >
      <div className={cls.viewport} ref={emblaRef}>
        <div className={cls.container}>
          {imageSets.map((set) => (
            <div className={cls.slide} key={set.url}>
              <Image {...set} isOnMobile={isOnMobile} />
            </div>
          ))}
        </div>
      </div>
      <ArrowButton direction="previous" />
      <ArrowButton direction="next" />
      <PagingDots />
    </div>
  )
}
