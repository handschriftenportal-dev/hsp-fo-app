import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

import MuiLink from '@material-ui/core/Link'
import Tooltip from '@material-ui/core/Tooltip'
import { makeStyles } from '@material-ui/core/styles'

import { useSearchTranslation } from 'src/components/search/utils'
import { actions } from 'src/contexts/actions/actions'
import { searchActions } from 'src/contexts/actions/searchActions'
import { CatalogItemProps, HspDigitized } from 'src/contexts/discovery'
import { createWorkspacePermalink, useModules } from 'src/contexts/modules'
import { searchSelectors } from 'src/contexts/selectors'
import { WorkspaceResource } from 'src/contexts/types'

import { FabButton } from '../../../search/shared/FabButton'
import { ThumbnailImage } from './ThumbnailImage'

const useStyles = makeStyles(() => ({
  link: {
    padding: 0,
    margin: 0,
  },
  tooltip: {
    maxWidth: 450,
  },
}))

interface IIIFThumbnailProps {
  currentDigi: HspDigitized | CatalogItemProps
  res: WorkspaceResource
  isAlreadyAdded: boolean
  setToastMessage: (msg: string) => void
}

export function IIIFThumbnail(props: Readonly<IIIFThumbnailProps>) {
  const { currentDigi, res, setToastMessage, isAlreadyAdded } = props
  const cls = useStyles()
  const { searchT } = useSearchTranslation()
  const { workspace } = useModules()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const searchParams = useSelector(searchSelectors.getSearchParams)

  const selectedResources = useSelector(searchSelectors.getSelectedResources)

  function addResource(res: WorkspaceResource) {
    // then create a permalink for that resource
    const permalink = createWorkspacePermalink(res.type, res.id)
    // and add the resource info to the workspace,
    const resources = workspace.getResources()
    const notInWorkspace = resources.every(
      ({ manifestId }) => res.id !== manifestId,
    )
    if (notInWorkspace) {
      if (res.type.includes('description')) {
        workspace.addResource({
          ...res,
          permalink,
          id: res.id,
        })
      } else {
        workspace.addResource({
          ...res,
          permalink,
          manifestId: res.id,
          id: 'hsp-window-' + uuidv4(),
        })
      }

      // // and add the resource info to the search module itself
      // // so it will be marked as selected
      dispatch(
        searchActions.setSelectedResources([
          ...selectedResources,
          { ...res, query: undefined },
        ]),
      )
      // and update the number in the workspace button in the sidebar.
      dispatch(actions.setWorkspaceBadgeCount(workspace.getResources().length))
    }
  }

  function openResource(res: WorkspaceResource) {
    addResource(res)
    dispatch(searchActions.setSearchParams(searchParams))
    navigate('/workspace')
  }

  function selectResource(what: 'select' | 'unselect', res: WorkspaceResource) {
    if (what === 'select') {
      addResource(res)
      setToastMessage('addToWorkspace')
    }
    if (what === 'unselect') {
      if (res.type.includes('description')) {
        workspace.removeResource(res)
      } else {
        // remove including all iiif duplicates
        workspace.removeResources(res.id) // in search id is a manifestId
      }
      // and remove the resource info from the search module itself
      // so it becomes unmarked.
      dispatch(
        searchActions.setSelectedResources(
          selectedResources.filter((r) => r.id !== res.id),
        ),
      )
      // and update the number in the workspace button in the sidebar.
      dispatch(actions.setWorkspaceBadgeCount(workspace.getResources().length))
      setToastMessage('removeFromWorkspace')
    }
  }

  return (
    <>
      <Tooltip
        title={searchT('resources', 'openManifestInWorkarea') as string}
        className={cls.tooltip}
      >
        <MuiLink
          aria-label={searchT('resources', 'openManifestInWorkarea')}
          className={cls.link}
          component="button"
          variant="body2"
          onClick={() => openResource(res)}
          tabIndex={0}
        >
          <ThumbnailImage digi={currentDigi} />
        </MuiLink>
      </Tooltip>
      <FabButton
        isAlreadyAdded={isAlreadyAdded}
        isThumbnail={true}
        onClickSelect={() => selectResource('select', res)}
        onClickUnselect={() => selectResource('unselect', res)}
      />
    </>
  )
}
