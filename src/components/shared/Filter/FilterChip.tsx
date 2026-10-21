import clsx from 'clsx'
import { makeStyles } from 'tss-react/mui'

import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
    background: theme.palette.platinum.main,
  },
  button: {
    cursor: 'pointer',
    marginLeft: theme.spacing(1),
    fontSize: '1.3rem',
    padding: 0,
  },
}))

interface Props {
  className?: string
  label: string
  onRemove: () => void
}

export function FilterChip(props: Readonly<Props>) {
  const { className, label, onRemove } = props
  const { classes: cls } = useStyles()

  return (
    <div className={clsx(cls.root, className)}>
      <Typography variant="body2">{label}</Typography>
      <IconButton className={clsx(cls.button)} onClick={onRemove} size="large">
        <CloseIcon />
      </IconButton>
    </div>
  )
}
