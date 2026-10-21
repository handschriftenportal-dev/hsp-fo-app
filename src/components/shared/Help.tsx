import clsx from 'clsx'
import React, { useEffect, useRef, useState } from 'react'
import { makeStyles } from 'tss-react/mui'

import CloseIcon from '@mui/icons-material/Close'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import { helpWalk } from '../../utils/helpWalk'

const useStyles = makeStyles()((theme) => ({
  dialog: {
    display: 'flex',
    flexDirection: 'row',
    margin: 0,
  },
  left: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  right: {
    padding: theme.spacing(2),
  },
  h1: {
    ...(theme.typography.h1 as React.CSSProperties),
  },
  h2: {
    ...(theme.typography.h2 as React.CSSProperties),
  },
  h3: {
    ...(theme.typography.subtitle1 as React.CSSProperties),
  },
  b: {
    ...(theme.typography.body2 as React.CSSProperties),
  },
  default: {
    ...(theme.typography.body1 as React.CSSProperties),
  },
}))

function HelpText(props: Readonly<{ html: string }>) {
  const { classes: cls } = useStyles()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = props.html

      helpWalk(ref.current as any, (node) => {
        if (node instanceof HTMLElement) {
          switch (node.tagName.toLowerCase()) {
            case 'h1':
              node.classList.add(cls.h1)
              break
            case 'h2':
              node.classList.add(cls.h2)
              break
            case 'h3':
              node.classList.add(cls.h3)
              break
            case 'b':
              node.classList.add(cls.b)
              break
            default:
              node.classList.add(cls.default)
          }
        }
      })
    }
  }, [])

  return <div ref={ref} />
}

interface Props {
  html: string
  'aria-label': string
}

export function Help(props: Readonly<Props>) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true })
  const { classes: cls } = useStyles()

  const [show, setShow] = useState(false)
  const toggle = () => setShow(!show)

  return (
    <>
      <IconButton
        onClick={toggle}
        aria-label={props['aria-label']}
        size="large"
      >
        <HelpOutlineIcon />
      </IconButton>
      <Dialog
        fullScreen={isMobile}
        classes={{
          paper: clsx(cls.dialog),
        }}
        open={show}
        onClose={toggle}
      >
        <div className={cls.left}>
          <HelpText html={props.html} />
        </div>
        <div className={cls.right}>
          <IconButton onClick={toggle} size="large">
            <CloseIcon />
          </IconButton>
        </div>
      </Dialog>
    </>
  )
}
