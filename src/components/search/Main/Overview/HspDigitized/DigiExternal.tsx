import { makeStyles } from 'tss-react/mui'

import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

import { useSearchTranslation } from 'src/components/search/utils'
import { Tooltip } from 'src/utils/Tooltip'

const useStyles = makeStyles()((theme) => ({
  bold: { fontWeight: 'bold' },
  link: {
    color: 'inherit',
  },
  linkTypo: {
    // Was the Tooltip's `className`, which MUI applies to the child trigger;
    // kept on the child so the noWrap URL still truncates at 450px.
    maxWidth: 450,
    '&:focus-within': {
      outline: `${theme.spacing(0.5)} solid ${theme.palette.white.main}`,
    },
  },
  marginTop: {
    marginTop: theme.spacing(2),
  },
}))

export interface DigiExternalProps {
  href: string
}

export function DigiExternal(props: Readonly<DigiExternalProps>) {
  const { searchT } = useSearchTranslation()
  const { classes: cls } = useStyles()
  const { href } = props

  return (
    <div className={cls.marginTop}>
      <Typography color="inherit" className={cls.bold}>
        {searchT('data', 'extPrasentation')}
      </Typography>
      <Tooltip title={searchT('resources', 'openDigitalImagesExternal')}>
        <Typography
          variant="body1"
          color="inherit"
          noWrap
          className={cls.linkTypo}
        >
          <Link
            className={cls.link}
            target="_blank"
            href={href}
            rel="noreferrer"
          >
            {href}
          </Link>
        </Typography>
      </Tooltip>
    </div>
  )
}
