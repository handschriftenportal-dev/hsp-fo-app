import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme) => ({
  root: {
    '& em': {
      background: theme.palette.electricBlue.main,
    },
  },
}))

export interface Props {
  children: string
}

export function Highlight(props: Readonly<Props>) {
  const { classes: cls } = useStyles()
  const { children } = props

  return (
    <span
      data-testid="discovery-highlight"
      className={cls.root}
      dangerouslySetInnerHTML={{ __html: children }}
    />
  )
}
