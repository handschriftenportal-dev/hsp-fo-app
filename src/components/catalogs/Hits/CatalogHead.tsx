import { makeStyles } from 'tss-react/mui'

import Typography from '@mui/material/Typography'

import { CatalogItemProps } from 'src/contexts/discovery'

const useStyles = makeStyles()((theme) => ({
  headLeft: {
    width: '75%',
  },
  headTypography: {
    width: '100%',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}))

interface Props {
  catalog: CatalogItemProps
}

export function CatalogHead(props: Readonly<Props>) {
  const { classes: cls } = useStyles()
  const { catalog } = props

  return (
    <div className={cls.headLeft}>
      <Typography variant="h2" className={cls.headTypography}>
        {catalog['catalog-title-display']}
      </Typography>
    </div>
  )
}
