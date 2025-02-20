import React from 'react'

import Link from '@material-ui/core/Link'

export function renderExtern(text: string, href: string) {
  return (
    <Link color="primary" target="_blank" rel="noopener" href={href}>
      {text}
    </Link>
  )
}
