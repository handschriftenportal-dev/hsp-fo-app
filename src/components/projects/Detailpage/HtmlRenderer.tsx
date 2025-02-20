import parse, { Element, HTMLReactParserOptions } from 'html-react-parser'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

import Link from '@material-ui/core/Link'

/**
 * Helper function to render an internal link (<intern> tag).
 */
function renderInternalLink(href: string, text: string) {
  return (
    <Link component={RouterLink} color="primary" to={href} tabIndex={0}>
      {text}
    </Link>
  )
}

/**
 * Helper function to render an external link (<a> tag).
 */
function renderExternalLink(href: string, text: string) {
  return (
    <Link color="primary" target="_blank" rel="noopener" href={href}>
      {text}
    </Link>
  )
}

interface Props {
  html: string
}

/**
 * Renders an HTML string to React element tree.
 */
export function HtmlRenderer(props: Readonly<Props>) {
  const { html } = props

  const options: HTMLReactParserOptions = {
    replace(node: Element | any) {
      if (!node.attribs || !node.children?.[0]?.data) {
        return null
      }

      const text = node.children[0].data as string

      switch (node.name) {
        case 'intern': {
          const { href } = node.attribs
          return renderInternalLink(href, text)
        }
        case 'a': {
          const { href } = node.attribs
          return renderExternalLink(href, text)
        }
        default:
          return null
      }
    },
  }

  const rendered = parse(html, options)
  return <>{rendered}</>
}
