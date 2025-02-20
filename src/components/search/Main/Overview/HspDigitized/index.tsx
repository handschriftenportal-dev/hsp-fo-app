import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import { HspDigitized } from 'src/contexts/discovery'

import { ResourceActionCard } from '../../../shared/ResourceActionCard'
import { useSearchTranslation } from '../../../utils'
import { SectionWrapper } from '../SectionWrapper'
import { DigiCardContent } from './DigiCardContent'
import { DigiExternal } from './DigiExternal'

const useStyles = makeStyles((theme) => ({
  cards: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  card: {
    background: theme.palette.liver.main,
    minWidth: 250,
    marginTop: theme.spacing(3),
    marginRight: theme.spacing(6),
    width: 200,
    color: 'white',
    padding: theme.spacing(2),
  },
  digitizedImages: {
    scrollMarginTop: '200px',
    scrollBehavior: 'smooth',
  },
}))

interface Props {
  hspDigitizeds: HspDigitized[]
}

export function HspDigitizeds({ hspDigitizeds }: Readonly<Props>) {
  const cls = useStyles()
  const { searchT } = useSearchTranslation()
  const title = `${searchT('overview', 'digitalImages')}: ${hspDigitizeds.length}`

  return (
    <SectionWrapper
      ariaLabel={searchT('overview', 'digitalImages')}
      className={cls.digitizedImages}
      id="hsp-digitizeds"
      title={title}
    >
      <div className={cls.cards}>
        {hspDigitizeds.map((hspDigitized) => (
          <ResourceActionCard
            key={hspDigitized.id}
            className={cls.card}
            resource={hspDigitized}
            off={!hspDigitized['manifest-uri-display']}
            head={<DigiCardContent hspDigitized={hspDigitized} />}
          >
            {hspDigitized['external-uri-display'] && (
              <DigiExternal href={hspDigitized['external-uri-display']} />
            )}
          </ResourceActionCard>
        ))}
      </div>
    </SectionWrapper>
  )
}
