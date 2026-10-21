import clsx from 'clsx'
import { makeStyles } from 'tss-react/mui'

import AddIcon from '@mui/icons-material/Add'
import CheckIcon from '@mui/icons-material/Check'
import Fab from '@mui/material/Fab'

import { Tooltip } from 'src/utils/Tooltip'

import { useSearchTranslation } from '../utils'

const useStyles = makeStyles()((theme) => ({
  fab: {
    right: theme.spacing(-3),
    position: 'absolute',
    top: theme.spacing(2),
    color: 'white',
  },
  fabIcon: {
    lineHeight: 'unset',
  },
  digitizedOutline: {
    '&:focus-visible': {
      outlineColor: theme.palette.white.main + '!important',
    },
  },
  liver: {
    backgroundColor: theme.palette.liver.main,
    '&:hover': {
      backgroundColor: theme.palette.liver.main,
    },
  },
  turquoise: {
    backgroundColor: theme.palette.turquoise.main,
    '&:hover': {
      backgroundColor: theme.palette.turquoise.main,
    },
  },
}))

interface Props {
  isAlreadyAdded: boolean
  onClickSelect: () => void
  onClickUnselect: () => void
  isDescription?: boolean
  isThumbnail?: boolean
}

export function FabButton(props: Readonly<Props>) {
  const {
    isAlreadyAdded,
    onClickSelect,
    onClickUnselect,
    isDescription,
    isThumbnail,
  } = props

  const { classes: cls } = useStyles()
  const { searchT } = useSearchTranslation()

  const alreadyAddedTitle = isDescription
    ? searchT('resources', 'removeDescription')
    : searchT('resources', 'removeDigitalImage')

  const notAddedTitle = isDescription
    ? searchT('resources', 'addDescription')
    : searchT('resources', 'addDigitalImage')

  const digiOutlineOverview = {
    [cls.digitizedOutline]: !isDescription && !isThumbnail,
  }

  const title = isAlreadyAdded ? alreadyAddedTitle : notAddedTitle
  const fabClass = isAlreadyAdded ? cls.liver : cls.turquoise

  return (
    <Tooltip title={title}>
      <Fab
        size="medium"
        className={clsx(cls.fab, fabClass, {
          ...digiOutlineOverview,
        })}
        onClick={isAlreadyAdded ? onClickUnselect : onClickSelect}
        aria-label={title}
      >
        {isAlreadyAdded ? (
          <CheckIcon className={cls.fabIcon} />
        ) : (
          <AddIcon className={cls.fabIcon} />
        )}
      </Fab>
    </Tooltip>
  )
}
