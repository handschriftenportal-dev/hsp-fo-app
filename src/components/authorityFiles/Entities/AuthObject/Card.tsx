import { makeStyles } from 'tss-react/mui'

import Typography from '@mui/material/Typography'

import { useSearchTranslation } from 'src/components/search/utils'
import { SinglePagePaper } from 'src/components/shared'
import { AuthItemProps } from 'src/contexts/discovery'

import { CardValue } from './CardValue'

const useStyles = makeStyles()((theme) => ({
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

export type NormCardKey = 'preferredName' | 'variantName'

interface NormCardProps {
  authItem: AuthItemProps
  cardData: NormCardKey[]
}

export function Card(props: Readonly<NormCardProps>) {
  const { authItem, cardData } = props
  const { searchT } = useSearchTranslation()
  const { classes: cls } = useStyles()

  return (
    <SinglePagePaper>
      <div className={cls.content}>
        {cardData.map((key) => {
          const value = authItem[key]
          if (value == null) return null
          return (
            <div key={key} className={cls.entry}>
              <Typography variant="body1" className={cls.typo}>
                {searchT('normOverview', key)}:{' '}
              </Typography>
              {CardValue(value)}
            </div>
          )
        })}
      </div>
    </SinglePagePaper>
  )
}
