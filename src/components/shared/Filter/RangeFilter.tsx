import clsx from 'clsx'
import React, { ChangeEvent, useState } from 'react'
import { useLocation } from 'react-router-dom'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import InputBase from '@material-ui/core/InputBase'
import Slider from '@material-ui/core/Slider'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import { useSearchTranslation } from 'src/components/search/utils'
import { RangeFilterData } from 'src/utils/searchparams'

import { FilterCheckbox } from './FilterCheckbox'

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1),
  },
  inputDiv: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginRight: theme.spacing(-2),
  },
  inputBase: {
    width: '70px',
    border: '1px solid #ccc',
    background: theme.palette.background.default,
    '& .hsp-search-MuiInputBase-input': {
      textAlign: 'center',
    },
  },
  input: {
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
  },
  inputPointer: {
    outline: 'none !important',
  },
  to: {
    color: 'inherit',
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
  },
  option: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  caption: {
    alignSelf: 'center',
    marginLeft: theme.spacing(0.5),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
  checkbox: {
    paddingLeft: theme.spacing(1.5),
  },
  missing: {
    alignSelf: 'center',
    fontStyle: 'italic',
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
  slider: {
    width: '90%',
    marginLeft: theme.spacing(2),
  },
  catalogSlider: {
    '& .MuiSlider-thumb': {
      '&:focus-visible': {
        outline: `${theme.spacing(0.5)}px solid ${
          theme.palette.white.main
        } !important`,
        outlineOffset: `${theme.spacing(0.5)}px !important`,
      },
    },
  },
  switch: {
    paddingTop: theme.spacing(0.5),
    paddingLeft: theme.spacing(2),
  },
  whiteFont: {
    color: theme.palette.white.main,
  },
  catalogTrack: {
    backgroundColor: `${theme.palette.white.main} !important`,
  },
  catalogSwitch: {
    '&.MuiSwitch-root.MuiSwitch-root:focus-within': {
      outline: `${theme.spacing(0.5)}px solid ${theme.palette.white.main} !important`,
    },
  },
}))

interface Props {
  label: string
  textMissing: string
  options: [number, number]
  exactOption?: boolean
  selected?: RangeFilterData
  onChange: (selected?: RangeFilterData) => void
  unit?: string
}

export function RangeFilter(props: Readonly<Props>) {
  const { exactOption, label, textMissing, options, selected, onChange, unit } =
    props
  const cls = useStyles()
  const { searchT } = useSearchTranslation()

  const location = useLocation()
  const isCatalogFilter = location.pathname.includes('catalog')

  const [pointerEvent, setPointerEvent] = useState(false)
  const [active, setActive] = useState(!!selected)
  const [value, setValue] = useState(
    selected || { from: options[0], to: options[1] },
  )
  const [from, setFrom] = useState(value?.from.toString() || '')
  const [to, setTo] = useState(value?.to.toString() || '')
  const [exact, setExact] = useState(
    value?.exact || (exactOption ? false : undefined),
  )
  const [missing, setMissing] = useState(value?.missing || false)

  const handleSwitchToggle = function (checked: boolean) {
    setActive(checked)
    onChange(checked ? value : undefined)
  }

  const setValueFrom = function (v: string) {
    const newValue: RangeFilterData = { ...value }

    if (v === undefined || !/\d/.test(v) || +v < options[0]) {
      setFrom(options[0].toString())
      newValue.from = options[0]
    } else if (+v > +to) {
      setFrom(to)
      newValue.from = value.to
    } else {
      newValue.from = +v
    }

    setValue(newValue)

    if (active) {
      onChange(newValue)
    }
  }

  const setValueTo = function (v: string) {
    const newValue: RangeFilterData = { ...value }

    if (v === undefined || !/\d/.test(v) || +v > options[1]) {
      setTo(options[1].toString())
      newValue.to = options[1]
    } else if (+v < +from) {
      setTo(from)
      newValue.to = value.from
    } else {
      newValue.to = +v
    }

    setValue(newValue)

    if (active) {
      onChange(newValue)
    }
  }

  const toggleExact = function () {
    const newExact = !exact
    const newValue = { ...value }
    newValue.exact = newExact

    setExact(newExact)
    setValue(newValue)
    setActive(true)
    onChange(newValue)
  }

  const toggleMissing = function () {
    const newMissing = !missing
    const newValue = { ...value }
    newValue.missing = newMissing

    setMissing(newMissing)
    setValue(newValue)
    setActive(true)
    onChange(newValue)
  }

  const textExactPeriod = searchT('filterPanel', 'exactPeriod')

  function handleInputChangeFrom(ev: ChangeEvent<HTMLInputElement>): void {
    setPointerEvent(true)
    setFrom(ev.target.value)
  }

  function handleInputChangeTo(ev: ChangeEvent<HTMLInputElement>): void {
    setPointerEvent(true)
    setTo(ev.target.value)
  }

  return (
    <div className={cls.root} data-testid={`range-filter-${label}`}>
      <div className={cls.inputDiv}>
        <InputBase
          data-testid={`range-filter-${label}-from`}
          className={cls.inputBase}
          placeholder={searchT('filterPanel', 'rangeFrom')}
          value={from}
          onBlur={() => setValueFrom(from)}
          onChange={handleInputChangeFrom}
          onKeyDown={() => setPointerEvent(false)}
          onPointerDown={() => setPointerEvent(true)}
          inputProps={{
            'aria-label': `${label} ${searchT('filterPanel', 'rangeFrom')}`,
            className: clsx(cls.input, { [cls.inputPointer]: pointerEvent }),
          }}
        />
        <Typography className={cls.to} variant="caption" component="span">
          {searchT('filterPanel', 'rangeTo')}
        </Typography>
        <InputBase
          data-testid={`range-filter-${label}-to`}
          className={cls.inputBase}
          placeholder={searchT('filterPanel', 'rangeTo')}
          value={to}
          onBlur={() => setValueTo(to)}
          onChange={handleInputChangeTo}
          onKeyDown={() => setPointerEvent(false)}
          onPointerDown={() => setPointerEvent(true)}
          inputProps={{
            'aria-label': `${label} ${searchT('filterPanel', 'rangeTo')}`,
            className: clsx(cls.input, { [cls.inputPointer]: pointerEvent }),
          }}
        />
        <Typography
          className={cls.to}
          data-testid={`range-filter-${label}-unit`}
          variant="caption"
          component="span"
        >
          {unit}
        </Typography>
      </div>
      <Slider
        // TODO: mui (v4) console error after moving slider (lower or upper bound) for first time
        className={
          isCatalogFilter
            ? clsx(cls.slider, cls.catalogSlider)
            : clsx(cls.slider)
        }
        data-testid={`range-filter-${label}-slider`}
        value={[value.from, value.to]}
        onChange={(e, v) => {
          const newValue = v as [number, number]
          setValue({
            ...value,
            from: newValue[0],
            to: newValue[1],
          })
          setFrom(newValue[0].toString())
          setTo(newValue[1].toString())
          if (!active) {
            setActive(true)
          }
        }}
        onChangeCommitted={(e, v) => {
          const newValue = v as [number, number]
          if (active) {
            onChange({
              ...value,
              from: newValue[0],
              to: newValue[1],
            })
          }
        }}
        valueLabelDisplay="auto"
        min={options[0]}
        max={options[1]}
        getAriaLabel={() => label}
      />
      <div className={cls.option}>
        <FormControlLabel
          label={
            <Typography
              variant="caption"
              component="span"
              className={
                isCatalogFilter ? clsx(cls.missing, cls.whiteFont) : cls.missing
              }
            >
              {textMissing}
            </Typography>
          }
          control={
            <FilterCheckbox
              onChange={toggleMissing}
              iconText={textMissing}
              checked={missing}
            />
          }
        />
      </div>
      {exactOption && (
        <div className={cls.option}>
          <FormControlLabel
            label={
              <Typography
                className={cls.caption}
                variant="caption"
                component="span"
              >
                {searchT('filterPanel', 'exactPeriod')}
              </Typography>
            }
            control={
              <FilterCheckbox
                onChange={toggleExact}
                iconText={textExactPeriod}
                checked={exact}
              />
            }
          />
        </div>
      )}
      <div className={cls.switch}>
        <FormControlLabel
          control={
            <Switch
              className={isCatalogFilter ? cls.catalogSwitch : ''}
              classes={{
                track: isCatalogFilter && !active ? cls.catalogTrack : '',
              }}
              data-testid={`range-filter-${label}-switch`}
              checked={active}
              onChange={(e, checked) => handleSwitchToggle(checked)}
              color="primary"
              size="small"
            />
          }
          label={
            <Typography
              className={
                isCatalogFilter ? clsx(cls.caption, cls.whiteFont) : cls.caption
              }
              variant="caption"
              component="span"
            >
              {searchT('filterPanel', 'activateRangeFilter')}
            </Typography>
          }
        />
      </div>
    </div>
  )
}
