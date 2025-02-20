import React, { useEffect, useRef, useState } from 'react'

import makeStyles from '@material-ui/core/styles/makeStyles'

import { HspDescription } from 'src/contexts/discovery'

import { ResourceActionCard } from '../../../shared/ResourceActionCard'
import { useSearchTranslation } from '../../../utils'
import { SectionWrapper } from '../SectionWrapper'
import { DescCardContent } from './DescCardContent'

const useStyles = makeStyles((theme) => ({
  cards: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  card: {
    marginTop: theme.spacing(3),
    width: 450,
    minHeight: 100,
    marginRight: theme.spacing(6),
    padding: theme.spacing(2),
    paddingRight: theme.spacing(4),
  },
  manuscriptDescriptions: {
    scrollMarginTop: '200px',
    scrollBehavior: 'smooth',
  },
}))

interface Props {
  hspDescriptions: HspDescription[]
}

export function HspDescriptions({ hspDescriptions }: Readonly<Props>) {
  const [maxHeight, setMaxHeight] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const cls = useStyles()
  const { searchT } = useSearchTranslation()

  const sortedDescriptions = hspDescriptions.slice().sort((a, b) => {
    if (a['publish-year-display'] && b['publish-year-display']) {
      // newest first
      return b['publish-year-display'] - a['publish-year-display']
    } else if (a['publish-year-display']) {
      // put descriptions with date before descriptions without
      return -1
    } else if (b['publish-year-display']) {
      // put descriptions with date before descriptions without
      return 1
    }
    return 0
  })
  const title = `${searchT('overview', 'manuscriptDescriptions')}: ${sortedDescriptions.length}`

  const calculateMaxHeight = (elements: NodeListOf<Element>) => {
    if (elements) {
      const heights = Array.from(elements).map(
        (el) => (el as HTMLElement).clientHeight,
      )
      if (heights.length > 0) {
        setMaxHeight(Math.max(...heights))
      }
    }
  }

  useEffect(() => {
    const container = ref.current
    if (container) {
      const elements = container.querySelectorAll('[id="descCardInfo"]')

      const observer = new ResizeObserver(() => calculateMaxHeight(elements))

      elements.forEach((element: Element) => {
        observer.observe(element)
      })

      return () => {
        observer.disconnect()
      }
    }
  }, [])

  return (
    <SectionWrapper
      ariaLabel={searchT('overview', 'manuscriptDescriptions')}
      className={cls.manuscriptDescriptions}
      id="hsp-descriptions"
      title={title}
    >
      <div className={cls.cards} ref={ref}>
        {sortedDescriptions.map((desc) => {
          const isRetroDesc = desc.type === 'hsp:description_retro'
          const off = isRetroDesc && !desc['catalog-iiif-manifest-url-display']

          return (
            <ResourceActionCard
              key={desc.id}
              className={cls.card}
              resource={desc}
              off={off}
              head={
                <DescCardContent
                  desc={desc}
                  isRetroDesc={isRetroDesc}
                  maxHeight={maxHeight}
                />
              }
            />
          )
        })}
      </div>
    </SectionWrapper>
  )
}
