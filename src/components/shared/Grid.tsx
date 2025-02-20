import React, { ReactNode } from 'react'

import MuiGrid from '@material-ui/core/Grid'

interface GridProps {
  className?: string
  children: ReactNode
  id?: string
}

export function Grid({ className, children, id }: Readonly<GridProps>) {
  return (
    <MuiGrid className={className} container justifyContent="center" id={id}>
      <MuiGrid item xs={12} sm={10} md={10} lg={10} xl={8}>
        {children}
      </MuiGrid>
    </MuiGrid>
  )
}
