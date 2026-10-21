import Link from '@mui/material/Link'

export function renderExtern(text: string, href: string) {
  return (
    <Link color="primary" target="_blank" rel="noopener" href={href}>
      {text}
    </Link>
  )
}
