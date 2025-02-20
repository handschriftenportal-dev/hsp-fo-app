import React from 'react'

import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/core/styles/makeStyles'

import { useSearchTranslation } from 'src/components/search/utils'
import { SinglePagePaper } from 'src/components/shared'
import { AuthItemProps } from 'src/contexts/discovery'

import { CardValue } from './CardValue'

const useStyles = makeStyles((theme) => ({
  content: {
    maxWidth: '50%',
  },
  entry: {
    marginBottom: theme.spacing(1),
  },
  typo: {
    fontWeight: 500,
  },
}))

interface NormCardProps {
  authItem: AuthItemProps
  cardData: (keyof AuthItemProps)[]
}

export function Card(props: Readonly<NormCardProps>) {
  const { authItem, cardData } = props
  const { searchT } = useSearchTranslation()
  const cls = useStyles()

  const filteredCardContent = cardData.reduce(
    (acc, key) => {
      if (key in authItem) {
        acc[key] = authItem[key]
      }
      return acc
    },
    {} as Record<string, unknown>,
  )

  const entries = Object.entries(filteredCardContent).filter(
    ([, value]) => value !== null,
  )

  return (
    <SinglePagePaper>
      <div className={cls.content}>
        {entries.map(([key, value]) => (
          <div key={key} className={cls.entry}>
            <Typography variant="body1" className={cls.typo}>
              {searchT('normOverview', key)}:{' '}
            </Typography>
            {CardValue(value)}
          </div>
        ))}
      </div>
    </SinglePagePaper>
  )
}
