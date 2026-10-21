import { makeStyles } from 'tss-react/mui'

import Link from '@mui/material/Link'

import { AcfProject } from 'src/contexts/wordpress'

interface Props {
  links: AcfProject['links']
}

const useStyles = makeStyles()(() => ({
  link: {
    hyphens: 'none',
  },
}))

export function ProjectLinks(props: Readonly<Props>) {
  const { classes: cls } = useStyles()
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
