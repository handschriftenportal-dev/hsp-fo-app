import { useDispatch, useSelector } from 'react-redux'

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import DeleteIcon from '@mui/icons-material/Delete'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'

import { LogicOperator } from 'src/components/search/config'
import { useSearchTranslation } from 'src/components/search/utils'
import { searchActions } from 'src/contexts/actions/searchActions'
import { extSearchSelectors } from 'src/contexts/selectors'

interface Props {
  index: number
  groupId: string
}

export default function BoolControl(props: Readonly<Props>) {
  const { searchT } = useSearchTranslation()
  const extFieldInfo = useSelector(extSearchSelectors.getExtendedFieldInfo)
  const { index, groupId } = props
  const dispatch = useDispatch()

  const handleAddField = (index: number, logicOperator: LogicOperator) => {
    dispatch(
      searchActions.addToExtSearchList({
        index,
        groupId,
        logicOperator,
        extFieldInfo,
      }),
    )
  }
  const removeSearchField = (index: number, groupId: string) => {
    dispatch(searchActions.removeFromExtSearchList({ index, groupId }))
  }

  const listLength = useSelector(extSearchSelectors.getExtendedSearchGroups)[0]
    .elements.length

  return (
    <>
      <IconButton
        onClick={() => removeSearchField(index, groupId)}
        aria-label={searchT('extendedSearch', 'removeField')}
        disabled={index === 0 && listLength === 1}
        size="large"
      >
        <DeleteIcon />
      </IconButton>
      <Button
        startIcon={<AddCircleOutlineIcon />}
        onClick={() => handleAddField(index, LogicOperator.OR)}
        aria-label={searchT('extendedSearch', 'addSearchField')}
      >
        {searchT('extendedSearch', 'or')}
      </Button>
      <Button
        startIcon={<AddCircleOutlineIcon />}
        onClick={() => handleAddField(index, LogicOperator.AND)}
        aria-label={searchT('extendedSearch', 'addSearchField')}
      >
        {searchT('extendedSearch', 'and')}
      </Button>
    </>
  )
}
