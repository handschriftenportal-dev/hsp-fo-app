import clsx from 'clsx'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import MuiButtonBase from '@material-ui/core/ButtonBase'
import makeStyles from '@material-ui/core/styles/makeStyles'

import { useSearchTranslation } from 'src/components/search/utils'
import { WorkspaceToast } from 'src/components/shared/WorkspaceToast'
import { HspDigitized } from 'src/contexts/discovery'
import { searchSelectors } from 'src/contexts/selectors'
import { WorkspaceResource } from 'src/contexts/types'

import { ExternalThumbnail } from './ExternalThumbnail'
import { IIIFThumbnail } from './IIIFThumbnail'
import { ThumbnailImage } from './ThumbnailImage'

const useStyles = makeStyles((theme) => ({
  root: {
    width: 120,
    position: 'relative',
  },
  button: {
    margin: 3,
    padding: 6,
    borderRadius: 45,
    cursor: 'pointer',
    background: theme.palette.liver.main,
  },
  navigation: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  on: {
    background: theme.palette.secondary.main,
  },
  buttonWrapper: {
    borderRadius: 45,
  },
}))

interface SearchThumbnailProps {
  hspDigitizeds: HspDigitized[]
}

export function SearchThumbnail(props: Readonly<SearchThumbnailProps>) {
  const { hspDigitizeds } = props
  const { searchT } = useSearchTranslation()

  const cls = useStyles()
  const [current, setCurrent] = useState(0)
  const [toastMessage, setToastMessage] = useState(null as null | string)

  const handleToastClose = () => {
    setToastMessage(null)
  }
  const digitizedsWithThumbnails = hspDigitizeds.filter(
    (digi) => digi['thumbnail-uri-display'],
  )
  const selectedResources = useSelector(searchSelectors.getSelectedResources)

  if (digitizedsWithThumbnails.length === 0) {
    return null
  }

  const currentDigi = digitizedsWithThumbnails[current]
  const isManifest = currentDigi['manifest-uri-display']
  const isExternal = !isManifest && currentDigi['external-uri-display']
  const isIncomplete = !(isManifest ?? isExternal)
  const type = 'iiif:manifest'

  const createResource = (id: string | null, kodId: string | undefined) =>
    ({
      id,
      type,
      kodId,
    }) as WorkspaceResource

  const res = createResource(
    currentDigi['manifest-uri-display'],
    currentDigi['group-id'],
  )

  const isAlreadyAdded = selectedResources.some(
    (r) => r.id === currentDigi['manifest-uri-display'],
  )

  return (
    <div className={cls.root}>
      {isManifest && (
        <IIIFThumbnail
          currentDigi={currentDigi}
          res={res}
          isAlreadyAdded={isAlreadyAdded}
          setToastMessage={setToastMessage}
        />
      )}
      {isExternal && <ExternalThumbnail currentDigi={currentDigi} />}
      {isIncomplete && <ThumbnailImage digi={currentDigi} />}
      <div className={cls.navigation} role="tablist">
        {digitizedsWithThumbnails.length > 1 &&
          digitizedsWithThumbnails.map((digi, index) => (
            <MuiButtonBase
              key={digi.id}
              className={cls.buttonWrapper}
              onClick={() => setCurrent(index)}
              role="tab"
            >
              <span
                className={clsx(cls.button, { [cls.on]: current === index })}
              />
            </MuiButtonBase>
          ))}
      </div>
      <WorkspaceToast
        open={toastMessage !== null}
        handleClose={handleToastClose}
        message={searchT('snackMsg', toastMessage)}
      />
    </div>
  )
}
