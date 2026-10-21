import clsx from 'clsx'
import { makeStyles } from 'tss-react/mui'

import Paper from '@mui/material/Paper'

import { Dfg } from '../shared/Dfg'
import { Miscellaneous } from '../shared/Miscellaneous'
import { SocialLinks } from '../shared/SocialLinks'

const useStyles = makeStyles()((theme) => ({
  root: {
    background: theme.palette.liver.main,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    justifyContent: 'center',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    '& > *': {
      padding: '1rem',
      textAlign: 'center',
      width: '100%',
    },
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing(4),
      '& > *': {
        width: 'calc(100% / 3)',
      },
    },
  },
  misc: {},
  empty: {
    padding: 0,
  },
}))

interface Props {
  className?: string
}

export function Footer(props: Readonly<Props>) {
  const { classes: cls } = useStyles()

  return (
    <Paper
      component="footer"
      className={clsx(cls.root, props.className)}
      elevation={24}
      square
    >
      <Dfg />
      <Miscellaneous className={cls.misc} />
      <SocialLinks />
    </Paper>
  )
}
