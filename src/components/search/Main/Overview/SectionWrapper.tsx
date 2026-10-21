import { clsx } from 'clsx'
import { ReactNode } from 'react'

import Typography from '@mui/material/Typography'

interface SectionWrapperProps {
  ariaLabel: string
  className: string
  id: string
  children: ReactNode
  title: string
}

export function SectionWrapper(props: Readonly<SectionWrapperProps>) {
  const { ariaLabel, children, className, id, title } = props
  return (
    <section
      aria-label={ariaLabel}
      className={clsx(className, 'addFocusable')}
      id={id}
      tabIndex={-1}
    >
      <div>
        <Typography
          variant="h2"
          color={id === 'hsp-digitizeds' ? 'inherit' : 'initial'}
        >
          {title}
        </Typography>
        {children}
      </div>
    </section>
  )
}
