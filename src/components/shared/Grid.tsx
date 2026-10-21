import { ReactNode } from 'react'

import MuiGrid from '@mui/material/GridLegacy'

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
