import clsx from 'clsx'
import React from 'react'
import { makeStyles } from 'tss-react/mui'

import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

interface StyleProps {
  resourceInfoFlexWrap: 'wrap' | 'nowrap'
}

const useStyles = makeStyles<StyleProps>()(
  (theme, { resourceInfoFlexWrap }) => ({
    headline: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: theme.spacing(0),
      marginTop: theme.spacing(2),
      flexWrap: resourceInfoFlexWrap,
      [theme.breakpoints.only('xs')]: {
        paddingLeft: theme.spacing(3.5),
        paddingRight: theme.spacing(3.5),
      },
    },
  }),
)

interface Props {
  className?: string
  children: React.ReactElement | React.ReactElement[]
}

export function SinglePageWrapper({ className, children }: Readonly<Props>) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true })
  const { classes: cls } = useStyles({
    resourceInfoFlexWrap: isMobile ? 'wrap' : 'nowrap',
  })

  return <div className={clsx(cls.headline, className)}>{children}</div>
}
