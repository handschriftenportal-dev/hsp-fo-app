import React from 'react'

import Link from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/core/styles'

import { AcfProject } from 'src/contexts/wordpress'

interface Props {
  links: AcfProject['links']
}

const useStyles = makeStyles(() => ({
  link: {
    hyphens: 'none',
  },
}))

export function ProjectLinks(props: Readonly<Props>) {
  const cls = useStyles()
  return (
    <>
      {props.links.split(',').map((href) => (
        <Link
          className={cls.link}
          key={href}
          href={href}
          rel="noopener"
          target="_blank"
          color="primary"
        >
          {href}
        </Link>
      ))}
    </>
  )
}
