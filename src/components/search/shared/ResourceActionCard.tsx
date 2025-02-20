import clsx from 'clsx'
import React, { ReactNode, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

import Fab from '@material-ui/core/Fab'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'

import { actions } from 'src/contexts/actions/actions'
import { searchActions } from 'src/contexts/actions/searchActions'
import { HspDescription, HspDigitized } from 'src/contexts/discovery'
import { createWorkspacePermalink, useModules } from 'src/contexts/modules'
import { searchSelectors } from 'src/contexts/selectors'
import { WorkspaceResource } from 'src/contexts/types'
import { Tooltip } from 'src/utils/Tooltip'

import { WorkspaceToast } from '../../shared/WorkspaceToast'
import { useSearchTranslation } from '../utils'
import { FabButton } from './FabButton'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
  },
  button: {
    lineHeight: 'unset',
  },
  fabButton: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(-3),
    color: 'white',
  },
  digitizedOutline: {
    '&:focus-visible': {
      outline: `${theme.spacing(0.5)}px solid ${
        theme.palette.white.main
      } !important`,
      outlineOffset: theme.spacing(0.25),
    },
  },
  head: {
    cursor: 'pointer',
  },
  off: {
    color: theme.palette.liver.main,
    cursor: 'not-allowed',
  },
  platinum: {
    backgroundColor: theme.palette.platinum.main,
    '&:hover': {
      backgroundColor: theme.palette.platinum.main,
    },
  },
}))

interface Props {
  className?: string
  resource: HspDescription | HspDigitized
  head?: ReactNode
  children?: ReactNode
  off?: boolean
  query?: string
}

export function ResourceActionCard(props: Readonly<Props>) {
  const { children, className, head, resource, off, query } = props
  const cls = useStyles()
  const { searchT } = useSearchTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { workspace } = useModules()

  const searchParams = useSelector(searchSelectors.getSearchParams)
  const selectedResources = useSelector(searchSelectors.getSelectedResources)

  const isDescription = resource.type !== 'hsp:digitized'
  const [isOpen, setIsOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState(null as null | string)

  const [res, setRes] = useState<WorkspaceResource>({
    type: 'hsp:description',
    id: resource.id,
    kodId: resource['group-id'],
  })
  const handleToastClose = () => {
    setToastMessage(null)
  }

  const isAlreadyAdded =
    resource.type === 'hsp:description' ||
    resource.type === 'hsp:description_retro'
      ? selectedResources.some((r) => r.id === resource.id)
      : selectedResources.some(
          (r) => r.id === (resource as HspDigitized)['manifest-uri-display'],
        )

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
  function openResource() {
    addResource(res)
    dispatch(searchActions.setSearchParams(searchParams))
    dispatch(searchActions.setSearchTerm(searchParams.q ?? ''))

    navigate('/workspace')
  }

  function selectResource(what: 'select' | 'unselect') {
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

  useEffect(() => {
    if (
      resource.type === 'hsp:description' ||
      resource.type === 'hsp:description_retro'
    ) {
      setRes({
        type: resource.type,
        id: resource.id,
        query,
        kodId: resource['group-id'],
      })
    } else if (resource.type === 'hsp:digitized') {
      // this is just a precaution.
      // it's recommended to check in the parent component if manifest-uri-display is present
      // and set props.off to true if not exists.
      if (resource['manifest-uri-display']) {
        setRes({
          type: 'iiif:manifest',
          id: resource['manifest-uri-display'],
          kodId: resource['group-id'],
        })
      }
    }
  }, [])

  return (
    <Paper className={clsx(cls.root, className)} square>
      {head && (
        <Tooltip
          title={
            isDescription
              ? searchT('resources', 'openDescription')
              : searchT('resources', 'openManifestInWorkarea')
          }
          disable={off}
        >
          <div
            className={
              isDescription
                ? clsx(!off && clsx(cls.head, 'addFocusableWithOutline'))
                : clsx(!off && clsx(cls.head, 'addFocusableWithWhiteOutline'))
            }
            tabIndex={!off ? 0 : -1}
            onClick={off ? undefined : () => openResource()}
            onKeyDown={
              off
                ? undefined
                : (e) => {
                    if (e.key === 'Enter') {
                      openResource()
                    }
                  }
            }
          >
            {head}
          </div>
        </Tooltip>
      )}
      {children}
      {!off ? (
        <FabButton
          isAlreadyAdded={isAlreadyAdded}
          isDescription={isDescription}
          onClickSelect={() => selectResource('select')}
          onClickUnselect={() => selectResource('unselect')}
        />
      ) : (
        isDescription && (
          <Fab
            size="medium"
            className={clsx(cls.fabButton, cls.platinum, cls.off)}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={searchT('resources', 'catalogNoDigitalCopy')}
          >
            <Tooltip
              title={searchT('resources', 'catalogNoDigitalCopy')}
              open={isOpen}
              onClose={() => setIsOpen(false)}
              onOpen={() => setIsOpen(true)}
            >
              <CloseIcon className={cls.button} />
            </Tooltip>
          </Fab>
        )
      )}
      <WorkspaceToast
        open={toastMessage !== null}
        handleClose={handleToastClose}
        message={searchT('snackMsg', toastMessage)}
      />
    </Paper>
  )
}
