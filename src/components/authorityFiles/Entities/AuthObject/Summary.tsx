import React from 'react'

import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/core/styles/makeStyles'
import LaunchIcon from '@material-ui/icons/Launch'

import { useSearchTranslation } from 'src/components/search/utils'
import { AuthItemProps } from 'src/contexts/discovery/discoveryTypes'

import { entityMapping } from '../../config'
import { EntityType } from './index'

const useStyles = makeStyles((theme) => ({
  summary: {
    marginTop: theme.spacing(2),
  },
  gndIdentifier: {
    display: 'flex',
  },
  gndLink: {
    color: theme.palette.primary.main,
    alignItems: 'center',
    display: 'flex',
    marginLeft: theme.spacing(0.5),
    whiteSpace: 'break-spaces',
  },
}))

interface SummaryProps {
  authItem: AuthItemProps
  layoutType: EntityType
}
export function Summary(props: Readonly<SummaryProps>) {
  const cls = useStyles()
  const { searchT } = useSearchTranslation()
  const { layoutType } = props
  const { typeName, gndId, id } = props.authItem

  const getSummaryTypeLabel = (layoutType: string, typeName: string) => {
    const headline = searchT('normOverview', 'typeName')

    const typeLabelKey = entityMapping[layoutType]

    const summaryLabel = `${headline}: ${searchT('normOverview', 'types', typeLabelKey)} `
    const typeLabel = `(${searchT('normOverview', 'types', typeName)})`

    return typeName !== typeLabelKey ? summaryLabel + typeLabel : summaryLabel
  }

  return (
    <div className={cls.summary}>
      <Typography component="p">
        {getSummaryTypeLabel(layoutType, typeName)}
      </Typography>
      <Typography component="p" className={cls.gndIdentifier}>
        {searchT('normOverview', 'gndIdentifier')}:
        <Link
          target="_blank"
          rel="noopener noreferrer"
          className={cls.gndLink}
          href={`https://d-nb.info/gnd/${gndId}`}
        >
          {gndId} <LaunchIcon fontSize="small" />
        </Link>
      </Typography>
      <Typography component="p">
        {searchT('normOverview', 'id')}: {id}
      </Typography>
    </div>
  )
}
