import clsx from 'clsx'
import { makeStyles } from 'tss-react/mui'

import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import { getImageSet } from 'src/components/projects/utils/projectsUtils'
import { useTranslation } from 'src/contexts/i18n'
import { AcfProject } from 'src/contexts/wordpress'

import { Grid } from '../../shared/Grid'
import { HtmlRenderer } from './HtmlRenderer'
import { ImgCarousel } from './ImgCarousel'

const useStyles = makeStyles()((theme) => ({
  root: {
    background: theme.palette.warmGrey.main,
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
    [theme.breakpoints.only('xs')]: {
      paddingLeft: theme.spacing(3.5),
      paddingRight: theme.spacing(3.5),
    },
  },
  textdiv: {
    width: '65%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  text: {
    marginLeft: theme.spacing(3),
    marginTop: theme.spacing(3),
    whiteSpace: 'pre-line',
    float: 'left',
  },
}))

interface Props {
  className?: string
  project: AcfProject
}

export function Description(props: Readonly<Props>) {
  const { project, className } = props
  const { classes: cls } = useStyles()
  const { t } = useTranslation()
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true })
  const imageSet = getImageSet(project)

  return (
    <section
      id="project-description"
      aria-label={t('projects.detailPage.additionalInfo')}
    >
      <div className={clsx(cls.root, className)}>
        <Grid>
          <div className={cls.textdiv}>
            <Typography variant="h2">
              {t('projects.detailPage.additionalInfo')}
            </Typography>
            <Typography component={'span'} className={cls.text} variant="body1">
              <div>
                <HtmlRenderer html={project.description} />
              </div>
            </Typography>
          </div>
          {mobile || (
            <ImgCarousel imageSet={imageSet} kodLink={project.kodLink} />
          )}
        </Grid>
      </div>
    </section>
  )
}
