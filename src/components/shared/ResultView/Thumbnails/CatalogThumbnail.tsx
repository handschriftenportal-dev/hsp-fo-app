import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles'

import { useSearchTranslation } from 'src/components/search/utils'
import { WorkspaceToast } from 'src/components/shared/WorkspaceToast'
import { CatalogItemProps } from 'src/contexts/discovery'
import { searchSelectors } from 'src/contexts/selectors'
import { WorkspaceResource } from 'src/contexts/types'

import { IIIFThumbnail } from './IIIFThumbnail'

const useStyles = makeStyles(() => ({
  root: {
    width: 120,
    position: 'relative',
  },
}))

interface CatalogThumbnailProps {
  catalog: CatalogItemProps
}

export function CatalogThumbnail(props: Readonly<CatalogThumbnailProps>) {
  const { catalog } = props
  const { searchT } = useSearchTranslation()
  const [toastMessage, setToastMessage] = useState(null as null | string)

  const handleToastClose = () => {
    setToastMessage(null)
  }

  const cls = useStyles()
  const selectedResources = useSelector(searchSelectors.getSelectedResources)
  const type = 'iiif:manifest'

  const createResource = (id: string | null) =>
    ({
      id,
      type,
    }) as WorkspaceResource

  const isAlreadyAdded = selectedResources.some(
    (r) => r.id === catalog['manifest-uri-display'],
  )

  const res = createResource(catalog['manifest-uri-display'])
  return (
    <div className={cls.root}>
      <IIIFThumbnail
        currentDigi={catalog}
        res={res}
        isAlreadyAdded={isAlreadyAdded}
        setToastMessage={setToastMessage}
      />
      <WorkspaceToast
        open={toastMessage !== null}
        handleClose={handleToastClose}
        message={searchT('snackMsg', toastMessage)}
      />
    </div>
  )
}
