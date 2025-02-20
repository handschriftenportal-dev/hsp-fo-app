import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import DeleteIcon from '@material-ui/icons/Delete'

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
