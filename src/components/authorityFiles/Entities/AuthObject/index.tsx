import urlJoin from 'proper-url-join'
import { makeStyles } from 'tss-react/mui'

import Typography from '@mui/material/Typography'

import { SinglePageWrapper } from 'src/components/shared'
import { AuthItemProps } from 'src/contexts/discovery'

import { Card, NormCardKey } from './Card'
import { ResourceLinks } from './ResourceLinks'
import { Summary } from './Summary'

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    marginTop: theme.spacing(2),
    flexWrap: 'wrap',
  },
  btnMenu: {
    marginTop: theme.spacing(2),
    flexShrink: 0,
  },
}))

export type EntityType = 'place' | 'person' | 'corporateBody'

interface AuthObjectProps {
  authItem: AuthItemProps
  numFound: string
  entityType: EntityType
}

const cardData: NormCardKey[] = ['preferredName', 'variantName']

export function AuthObject(props: Readonly<AuthObjectProps>) {
  const { classes: cls } = useStyles()

  const { authItem, numFound, entityType } = props
  const { preferredName, id } = authItem

  const url = new URL(window.location.origin)
  const permalink = urlJoin(url.href, `?id=${id}`)

  return (
    <div className={cls.root}>
      <SinglePageWrapper>
        <div>
          <Typography className={cls.title} variant="h1">
            {preferredName}
          </Typography>
          <Summary authItem={authItem} layoutType={entityType} />
        </div>
        <div className={cls.btnMenu}>
          <ResourceLinks numFound={numFound} permalink={permalink} />
        </div>
      </SinglePageWrapper>
      <Card authItem={authItem} cardData={cardData} />
    </div>
  )
}
