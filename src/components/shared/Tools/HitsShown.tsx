import clsx from 'clsx'
import { useDispatch } from 'react-redux'
import { Link, useLocation } from 'react-router'
import { makeStyles } from 'tss-react/mui'

import Button from '@mui/material/Button'
import FormGroup from '@mui/material/FormGroup'

import { searchActions } from 'src/contexts/actions/searchActions'
import { toSearchParams, useParsedSearchParams } from 'src/utils/searchparams'

const useStyles = makeStyles()((theme) => ({
  button: {
    borderRadius: '50%',
    fontWeight: 400,
    height: theme.spacing(4),
    '&:focus': {
      background: theme.palette.white.main,
    },
    [theme.breakpoints.up('md')]: {
      minWidth: theme.spacing(4),
    },
    [theme.breakpoints.down('lg')]: {
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
  const { classes: cls } = useStyles()
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
  const { classes: cls } = useStyles()
  const hitsOptions = [10, 20, 50, 100]

  return (
    <FormGroup className={cls.root}>
      {hitsOptions.map((elem) => {
        return <ShownButton value={elem} key={elem} />
      })}
    </FormGroup>
  )
}
