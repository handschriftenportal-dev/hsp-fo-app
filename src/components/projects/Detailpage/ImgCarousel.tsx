import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { makeStyles } from 'tss-react/mui'

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import Button from '@mui/material/Button'
import ListItemIcon from '@mui/material/ListItemIcon'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import {
  ImageSet,
  replaceImageUrl,
} from 'src/components/projects/utils/projectsUtils'
import { useEmblaControls } from 'src/components/shared/useEmblaControls'

const useStyles = makeStyles()((theme) => ({
  carousel: {
    width: '25%',
    float: 'right',
    position: 'relative',
  },
  viewport: { overflow: 'hidden' },
  container: { display: 'flex', touchAction: 'pan-y pinch-zoom' },
  slide: { flex: '0 0 100%', minWidth: 0 },
  figure: { margin: 0 },
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
  img: {
    height: '100%',
    width: '100%',
    objectFit: 'cover',
  },
  imgInfo: {
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
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
  const { classes: cls } = useStyles()
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true })
  const { imageSet } = props
  const { t } = useTranslation()

  const { emblaRef, canPrev, canNext, scrollPrev, scrollNext } =
    useEmblaControls()

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
      <div className={cls.viewport} ref={emblaRef}>
        <div className={cls.container}>
          {imageSet.map((set: ImageSet) => (
            <div className={cls.slide} key={set.img}>
              <figure className={cls.figure}>
                <img
                  className={cls.img}
                  src={replaceImageUrl(set.img)}
                  alt={set.imgInfo}
                />
                <Typography component="figcaption" className={cls.imgInfo}>
                  {set.imgInfo}
                </Typography>
              </figure>
            </div>
          ))}
        </div>
      </div>
      <ArrowButton direction="previous" />
      <ArrowButton direction="next" />
    </div>
  )
}
