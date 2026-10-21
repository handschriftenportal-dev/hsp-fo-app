import clsx from 'clsx'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router'
import { makeStyles } from 'tss-react/mui'
import { v4 as uuidv4 } from 'uuid'

import CloseIcon from '@mui/icons-material/Close'
import Fab from '@mui/material/Fab'
import MuiLink from '@mui/material/Link'

import { useSearchTranslation } from 'src/components/search/utils'
import { actions } from 'src/contexts/actions/actions'
import { searchActions } from 'src/contexts/actions/searchActions'
import { CatalogItemProps, HspDigitized } from 'src/contexts/discovery'
import { createWorkspacePermalink, useModules } from 'src/contexts/modules'
import { searchSelectors } from 'src/contexts/selectors'
import { WorkspaceResource } from 'src/contexts/types'
import { Tooltip } from 'src/utils/Tooltip'
import { useParsedSearchParams } from 'src/utils/searchparams'

import { FabButton } from '../../../search/shared/FabButton'
import { ThumbnailImage } from './ThumbnailImage'

const useStyles = makeStyles()((theme) => ({
  link: {
    padding: 0,
    margin: 0,
    // Was previously passed as the Tooltip's `className`, which MUI applies to
    // the child trigger (not the bubble); kept on the child to preserve layout.
    maxWidth: 450,
    '&[disabled]': {
      pointer: 'grey',
      cursor: 'default',
      '&:hover': {
        textDecoration: 'none',
      },
    },
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

interface IIIFThumbnailProps {
  currentDigi: HspDigitized | CatalogItemProps
  res: WorkspaceResource
  isAlreadyAdded: boolean
  setToastMessage: (msg: string) => void
  off?: boolean
}

export function IIIFThumbnail(props: Readonly<IIIFThumbnailProps>) {
  const { currentDigi, res, setToastMessage, isAlreadyAdded, off } = props
  const { classes: cls } = useStyles()
  const { searchT } = useSearchTranslation()
  const { workspace } = useModules()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const rememberedSearchParams = useSelector(searchSelectors.getSearchParams)
  const liveSearchParams = useParsedSearchParams()

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
    // On /search stamp the live URL so the remembered search read off-route by
    // the sidebar "Search" link does not inherit the Redux mirror's lag. This
    // thumbnail is also rendered on /catalogs, where the URL carries no search
    // params, so keep the remembered last search there.
    dispatch(
      searchActions.setSearchParams(
        location.pathname === '/search'
          ? liveSearchParams
          : rememberedSearchParams,
      ),
    )
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

  const openInWorkspaceTooltip = searchT(
    'resources',
    off ? 'catalogNoDigitalCopy' : 'openManifestInWorkarea',
  )

  return (
    <>
      <Tooltip title={openInWorkspaceTooltip}>
        <MuiLink
          aria-label={openInWorkspaceTooltip}
          className={cls.link}
          component="button"
          variant="body2"
          disabled={!!off}
          onClick={() => openResource(res)}
          tabIndex={0}
        >
          <ThumbnailImage digi={currentDigi} />
        </MuiLink>
      </Tooltip>
      {!off ? (
        <FabButton
          isAlreadyAdded={isAlreadyAdded}
          isThumbnail={true}
          onClickSelect={() => selectResource('select', res)}
          onClickUnselect={() => selectResource('unselect', res)}
        />
      ) : (
        <Fab
          size="medium"
          className={clsx(cls.fabButton, cls.platinum, cls.off)}
          aria-label={searchT('resources', 'catalogNoDigitalCopy')}
        >
          <Tooltip title={searchT('resources', 'catalogNoDigitalCopy')}>
            <CloseIcon className={cls.button} />
          </Tooltip>
        </Fab>
      )}
    </>
  )
}
