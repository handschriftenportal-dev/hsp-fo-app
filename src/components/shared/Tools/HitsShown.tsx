import clsx from 'clsx'
import React from 'react'
import { useDispatch } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'

import Button from '@material-ui/core/Button'
import FormGroup from '@material-ui/core/FormGroup'
import { makeStyles } from '@material-ui/core/styles'

import { searchActions } from 'src/contexts/actions/searchActions'
import { toSearchParams, useParsedSearchParams } from 'src/utils/searchparams'

const useStyles = makeStyles((theme) => ({
  button: {
    borderRadius: '50%',
    fontWeight: 400,
    height: theme.spacing(4),
    '&:focus': {
      background: theme.palette.white,
    },
    [theme.breakpoints.up('md')]: {
      minWidth: theme.spacing(4),
    },
    [theme.breakpoints.down('md')]: {
      minWidth: theme.spacing(2),
    },
  },
  selected: {
    background: 'white',
    fontWeight: 'bold',
  },
  root: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'row',
    paddingLeft: theme.spacing(1),
  },
}))

interface ShownButtonProps {
  value: number
}
function ShownButton(props: Readonly<ShownButtonProps>) {
  const params = useParsedSearchParams()
  const { rows } = params
  const { value } = props
  const cls = useStyles()
  const parsedLocation = useLocation()
  const dispatch = useDispatch()

  const isDefault = !rows && value === 10
  const location = (rows: number) =>
    `${parsedLocation.pathname}?${toSearchParams({ ...params, rows })}`

  const handleClick = parsedLocation.pathname.includes('/search')
    ? () => dispatch(searchActions.deleteAllHits())
    : undefined

  return (
    <Button
      size="small"
      disabled={rows === value || isDefault}
      className={clsx(cls.button, {
        [cls.selected]: rows === value || isDefault,
      })}
      component={Link}
      to={location(value)}
      onClick={handleClick}
    >
      {value}
    </Button>
  )
}

export function HitsShown() {
  const cls = useStyles()
  const hitsOptions = [10, 20, 50, 100]

  return (
    <FormGroup className={cls.root}>
      {hitsOptions.map((elem) => {
        return <ShownButton value={elem} key={elem} />
      })}
    </FormGroup>
  )
}
