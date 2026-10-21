import { useState } from 'react'
import { makeStyles } from 'tss-react/mui'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'

import { useSearchTranslation } from 'src/components/search/utils'
import { Tooltip } from 'src/utils/Tooltip'

import { Highlight } from '../../../search/Main/ListView/Hits/Highlight'

const useStyles = makeStyles()((theme) => ({
  row: {
    display: 'grid',
    gap: theme.spacing(4),
    gridTemplateColumns: '200px 1fr',
    hyphens: 'auto',
    padding: `${theme.spacing(1)} 0`,
    wordBreak: 'break-word',
  },
  highlight: {
    marginBottom: theme.spacing(2),
  },
  toggleButton: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginBottom: theme.spacing(1),
  },
}))

interface FullTextHighlightProps {
  highlighting?: string[]
  loading: boolean
  handleContextLoading: () => void
}

export function FullTextHighlight({
  highlighting,
  loading,
  handleContextLoading,
}: Readonly<FullTextHighlightProps>) {
  const { classes: cls } = useStyles()
  const { searchT } = useSearchTranslation()
  const [isVisible, setIsVisible] = useState(false)

  const handleToggle = () => {
    if (!highlighting && !loading) {
      handleContextLoading()
    }
    setIsVisible((prev) => !prev)
  }

  const renderFragments = () => {
    if (loading) {
      return (
        <>
          <Skeleton
            className={cls.highlight}
            variant="text"
            width="100%"
            height={24}
          />
          <Skeleton
            className={cls.highlight}
            variant="text"
            width="90%"
            height={24}
          />
        </>
      )
    }

    if (!highlighting?.length) return null

    return highlighting.map((fragment, index) => (
      <div key={`highlight-fragment-${index}`} className={cls.highlight}>
        <Typography component="span" variant="body1">
          <Highlight>{fragment}</Highlight>
        </Typography>
      </div>
    ))
  }

  return (
    <div className={cls.row}>
      <Typography component="div" variant="body2">
        {searchT('data', 'catalog-fulltext-display', '__field__')}
      </Typography>
      <div>
        <Tooltip
          title={
            isVisible
              ? searchT('hit', 'hideResultContext')
              : searchT('hit', 'showResultContext')
          }
        >
          <IconButton
            onClick={handleToggle}
            aria-label={
              isVisible
                ? searchT('hit', 'hideResultContext')
                : searchT('hit', 'showResultContext')
            }
            className={cls.toggleButton}
            size="large"
          >
            <ExpandMoreIcon
              style={{ transform: isVisible ? 'rotate(180deg)' : 'none' }}
            />
          </IconButton>
        </Tooltip>

        {isVisible && renderFragments()}
      </div>
    </div>
  )
}
