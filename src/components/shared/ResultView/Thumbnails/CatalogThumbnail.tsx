import { useState } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from 'tss-react/mui'

import { useSearchTranslation } from 'src/components/search/utils'
import { WorkspaceToast } from 'src/components/shared/WorkspaceToast'
import { CatalogItemProps } from 'src/contexts/discovery'
import { searchSelectors } from 'src/contexts/selectors'
import { WorkspaceResource } from 'src/contexts/types'

import { IIIFThumbnail } from './IIIFThumbnail'

const useStyles = makeStyles()(() => ({
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

  const { classes: cls } = useStyles()
  const selectedResources = useSelector(searchSelectors.getSelectedResources)

  const type = 'iiif:manifest'
  const catalogIiifDisplay = 'catalog-iiif-manifest-url-display'

  const off = !catalog[catalogIiifDisplay]

  const handleToastClose = () => {
    setToastMessage(null)
  }

  const createResource = (id: string | null) =>
    ({
      id,
      type,
    }) as WorkspaceResource

  const isAlreadyAdded = selectedResources.some(
    (r) => r.id === catalog[catalogIiifDisplay],
  )

  const res = createResource(catalog[catalogIiifDisplay])
  return (
    <div className={cls.root}>
      <IIIFThumbnail
        currentDigi={catalog}
        off={off}
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
