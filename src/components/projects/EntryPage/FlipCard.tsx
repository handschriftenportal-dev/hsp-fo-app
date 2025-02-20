import clsx from 'clsx'
import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import { AcfProject } from 'src/contexts/wordpress'

import { CardBack } from './CardBack'
import { CardFront } from './CardFront'

const useStyles = makeStyles((theme) => ({
  back: {
    transform: 'rotateX(180deg)',
    position: 'absolute',
    backfaceVisibility: 'hidden',
    height: '100%',
    width: '100%',
  },
  flip: {
    transform: 'rotateX(180deg)',
  },
  front: {
    left: 0,
    position: 'absolute',
    backfaceVisibility: 'hidden',
    height: '100%',
    width: '100%',
  },
  outerCard: {
    scrollMarginTop: '200px',
    scrollBehavior: 'smooth',
    justifyContent: 'center',
    transformStyle: 'preserve-3d',
    margin: theme.spacing(2),
    width: '40%',
    transitionDuration: '1.2s',
    transitionDelay: '150ms',
    transition: 'transform 0.2s',
    display: 'flex',
    cursor: 'pointer',
    height: '450px',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      height: '350px',
    },
  },
}))

interface Props {
  project: AcfProject
}

export function FlipCard(props: Readonly<Props>) {
  const {
    projectTitle,
    start,
    end,
    thumbnail,
    involvedInstitutions,
    status,
    runningTime,
    descriptionShort,
    id,
    support,
    className,
  } = props.project
  const cls = useStyles()

  const [flip, setFlip] = useState(false)

  function handleClick() {
    setFlip(!flip)
  }
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter') {
      setFlip(!flip)
    }
  }

  return (
    <div
      aria-roledescription="flipcard"
      className={clsx(cls.outerCard, className, 'addFocusable', {
        [cls.flip]: flip,
      })}
      onClick={handleClick}
      onKeyDown={(e) => handleKeyDown(e)}
      tabIndex={0}
      id="flipcard"
    >
      <div className={cls.front}>
        <CardFront
          projectTitle={projectTitle}
          start={start}
          end={end}
          thumbnail={thumbnail}
          involvedInstitutions={involvedInstitutions}
          status={status}
          runningTime={runningTime}
          support={support}
          id={id}
        />
      </div>
      <div className={cls.back}>
        <CardBack descriptionShort={descriptionShort} id={id} flip={flip} />
      </div>
    </div>
  )
}
