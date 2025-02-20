import React from 'react'
import { Link } from 'react-router-dom'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import { ResourceActionCard } from 'src/components/search/shared/ResourceActionCard'
import { getAuthorDateLine } from 'src/components/search/shared/getAuthorDateLine'
import { useSearchTranslation } from 'src/components/search/utils'
import {
  Highlighting,
  HspDescription,
  HspDocument,
  HspObject,
} from 'src/contexts/discovery'
import { Tooltip } from 'src/utils/Tooltip'
import { toSearchParams, useParsedSearchParams } from 'src/utils/searchparams'

import { Highlight } from './Highlight'

const useStyles = makeStyles(() => ({
  hspId: {
    fontWeight: 350,
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
  highlight: {
    marginBottom: '1rem',
  },
  snippetContainer: {
    margin: '1rem 0',
  },
}))

interface Props {
  className?: string
  document: HspDocument
  highlighting: Highlighting
}

export function Citation(props: Props) {
  const { className, document, highlighting } = props
  const cls = useStyles()
  const docHighlighting = highlighting[document.id]
  const isHspDescription =
    document.type === 'hsp:description' ||
    document.type === 'hsp:description_retro'
  const { searchT } = useSearchTranslation()

  const params = useParsedSearchParams()

  if (!docHighlighting || Object.keys(docHighlighting).length === 0) {
    return null
  }

  const snippets = Object.entries(docHighlighting).map(([field, fragments]) => (
    <div key={field} className={cls.snippetContainer}>
      <Typography component="div" variant="body2">
        {searchT('data', field, '__field__') + ': '}
      </Typography>
      <div>
        {fragments.map((elem, index) => (
          <div
            key={`${document.id}-search-fragment-${index}`}
            className={cls.highlight}
          >
            <Typography component="span" variant="body1">
              <Highlight>{elem}</Highlight>
            </Typography>
          </div>
        ))}
      </div>
    </div>
  ))

  function renderDescriptionCard(desc: HspDescription) {
    const authorDateLine = getAuthorDateLine(desc)
    const off =
      desc.type === 'hsp:description_retro' &&
      !desc['catalog-iiif-manifest-url-display']

    return (
      <ResourceActionCard
        className={className}
        resource={desc}
        off={off}
        head={
          <>
            <Typography variant="body2" gutterBottom>
              {searchT('data', 'type', document.type)}
            </Typography>
            <Typography>{authorDateLine}</Typography>
            {!authorDateLine && (
              <Typography variant="body1" className={cls.hspId}>
                {desc.id}
              </Typography>
            )}
          </>
        }
      >
        {snippets}
      </ResourceActionCard>
    )
  }

  function renderObjectCard(hspObject: HspObject) {
    return (
      <Paper className={className} square>
        <Tooltip title={searchT('overview', 'showKodOverview')}>
          <Link
            className={cls.link}
            to={`/search?${toSearchParams({
              ...params,
              hspobjectid: hspObject.id,
            })}`}
          >
            <Typography variant="body2">
              {searchT('data', 'type', hspObject.type)}
            </Typography>
          </Link>
        </Tooltip>
        {snippets}
      </Paper>
    )
  }

  return isHspDescription
    ? renderDescriptionCard(document as HspDescription)
    : renderObjectCard(document as HspObject)
}
