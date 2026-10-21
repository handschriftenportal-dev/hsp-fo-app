import clsx from 'clsx'
import { makeStyles } from 'tss-react/mui'

import ImageNotSupportedSharpSVG from './ImageNotSupported'

const useStyles = makeStyles()((theme) => ({
  brokenImg: {
    alignItems: 'center',
    backgroundColor: theme.palette.white.main,
    display: 'flex',
    justifyContent: 'center',
    minHeight: 160,
    width: 120,
  },
}))

export function BrokenImage(props: { className?: string }) {
  const { className } = props
  const { classes: cls } = useStyles()
  return (
    <div className={clsx(className, cls.brokenImg)}>
      <ImageNotSupportedSharpSVG />
    </div>
  )
}
