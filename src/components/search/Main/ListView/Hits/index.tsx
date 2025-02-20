import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import makeStyles from '@material-ui/core/styles/makeStyles'

import { hasHighlights } from 'src/components/search/utils'
import { HitWrapper } from 'src/components/shared/ResultView/ResultHits/HitWrapper'
import { searchActions } from 'src/contexts/actions/searchActions'
import { Highlighting, HspObjectGroup } from 'src/contexts/discovery'
import { searchSelectors } from 'src/contexts/selectors'

import { Citations } from './Citations'
import { SearchHitContent } from './SearchHitContent'
import { SearchHitHead } from './SearchHitHead'

const useStyles = makeStyles((theme) => ({
  headline: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(2),
  },
}))

interface Props {
  entry: HspObjectGroup
  highlighting: Highlighting
}

export function KeyDataSearch({ entry, highlighting }: Readonly<Props>) {
  const cls = useStyles()
  const dispatch = useDispatch()

  const variant = useSelector(searchSelectors.getHitListVariant)
  const hits = useSelector(searchSelectors.getHits)

  const id = entry.hspObject['group-id']

  const isExpandedOrKeyData = variant === 'expanded' || variant === 'keyData'
  const isExpandedOrCitations =
    variant === 'expanded' || variant === 'citations'

  const hit = hits[id] || {
    open: isExpandedOrKeyData,
    citationOpen: isExpandedOrCitations,
  }

  const toggle = (field: 'open' | 'citationOpen') => {
    dispatch(
      searchActions.setHitOpen({
        id,
        [field]: !hit[field],
      }),
    )
  }

  useEffect(() => {
    if (!hits[id]) {
      dispatch(
        searchActions.setHitOpen({
          id,
          open: isExpandedOrKeyData,
          citationOpen: isExpandedOrCitations,
        }),
      )
    }
  }, [isExpandedOrKeyData, isExpandedOrCitations, hits])

  return (
    <>
      <HitWrapper>
        <>
          <div className={cls.headline}>
            <SearchHitHead
              hspObjectGroup={entry}
              open={hit.open as boolean}
              toggle={() => toggle('open')}
            />
          </div>
          <SearchHitContent hspObjectGroup={entry} open={hit.open as boolean} />
        </>
      </HitWrapper>
      {hasHighlights(entry, highlighting) && (
        <Citations
          hspObjectGroup={entry}
          highlighting={highlighting}
          toggle={() => toggle('citationOpen')}
          open={hit.citationOpen as boolean}
        />
      )}
    </>
  )
}
