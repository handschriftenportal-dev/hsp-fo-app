import urlJoin from 'proper-url-join'
import React, { useEffect, useLayoutEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { WordpressPage } from 'src/contexts/wordpress'
import { getSlug } from 'src/utils'

import packageJson from '../../../package.json'

interface Props {
  wordpressPage: WordpressPage
}

export function Page(props: Readonly<Props>) {
  const { wordpressPage } = props
  const ref = useRef<HTMLElement>(null)
  const navigate = useNavigate()

  /**
   * Given an anchor element that refers to a Wordpress page:
   *
   *
   * Modify its href attribute to be an valid url in the context of the
   * host application. E.g. if the original href was:
   *
   *     http://wordpress.backend.de/about
   *
   * then the resulting href may look like:
   *
   *     http://handschriftenportal.de/blog/about
   *
   * if the host application mounts the module to /blog.
   *
   */
  function modifyPageLink(a: HTMLAnchorElement, hash: string) {
    const slug = getSlug(new URL(a.href).pathname)

    if (!slug) {
      console.warn('Page: could not get slug from worpress page link.')
      return
    }

    const url = new URL(urlJoin('/info', '/' + slug), location.origin)
    url.hash = hash

    a.addEventListener('click', (e) => {
      e.preventDefault()
      navigate(url.href, { preventScrollReset: true })
    })
    a.classList.add('internal')
  }

  function modifyInternalLink(a: HTMLAnchorElement) {
    const url = new URL(a.href, location.origin)

    if (!a.href.startsWith('mailto:')) {
      a.addEventListener('click', (e) => {
        e.preventDefault()
        navigate(url.href, { preventScrollReset: true })
      })
    }
    a.classList.add('internal')
  }

  function scrollToId(id: string) {
    const elem = document
      .querySelector('#page-shadow-container')
      ?.shadowRoot?.getElementById(id)
    if (elem) {
      elem.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }

  function modifyHashAnchor(a: HTMLAnchorElement, id: string) {
    a.addEventListener('click', () => {
      scrollToId(id)
    })
    a.classList.add('internal')
  }

  /**
   * Given an anchor element with an absolute href, make sure the
   * link opens in a new tab.
   */
  function modifyExternalLink(a: HTMLAnchorElement) {
    a.target = '_blank'
    a.classList.add('external')
  }

  /**
   * Given an media element with an src attribute, change the src attribute
   * so that it points to the wordpress resolve endpoint with the original
   * url as query parameter.
   *
   * The resolve endpoint inspects the original url and determines whether
   * the resource must bo loaded through a proxy. This is neccessary because
   * resources from the wordpress backend cannot be accessed directly from the browser.
   */
  function modifySrcAttribute(
    elem: HTMLAudioElement | HTMLImageElement | HTMLVideoElement,
  ) {
    elem.src = '/api/wordpress/resolve?originalUrl=' + elem.src

    // Image elements may have an additional srcset attribute
    if (elem.tagName === 'IMG') {
      const img = elem as HTMLImageElement
      img.srcset = img.srcset
        .split(', ')
        .map((srcdef) => '/api/wordpress/resolve?originalUrl=' + srcdef)
        .join(', ')
    }
  }

  // We use `useLayoutEffect` to make sure that the HTML will not be rendered
  // before all transformations to the elements are done. Otherwise the browser
  // is going to load resources (images etc.) before we had the chance to
  // set the correct urls.
  useLayoutEffect(() => {
    // For each anchor element of the HTML from Wordpress.
    ref.current?.querySelectorAll<HTMLAnchorElement>('a').forEach((a) => {
      const anchorId = new URL(a.href, location.origin).hash.replace('#', '')
      // Links to other Wordpress pages have data-type=page (default)
      // or type=page (with Yoast plugin)
      if (
        a.getAttribute('data-type') === 'page' ||
        a.getAttribute('type') === 'page'
      ) {
        modifyPageLink(a, anchorId)
        // Links with relative urls are considered internal links that
        // refer to pages of the host application.
      } else if (
        !a.getAttribute('href')?.match(/^https?:\/\//) &&
        !a.getAttribute('href')?.includes('#')
      ) {
        modifyInternalLink(a)
        // Links containing only relative hash (e.g href='#anchorTarget') refer to same page anchor targets
      } else if (a.getAttribute('href')?.includes('#')) {
        modifyHashAnchor(a, anchorId)
        // Treat every other link as an external link that should be
        // opened in a new tab.
      } else {
        modifyExternalLink(a)
      }
    })

    ref.current
      ?.querySelectorAll<
        HTMLImageElement | HTMLAudioElement | HTMLVideoElement
      >('img, audio, video')
      .forEach(modifySrcAttribute)
  })

  useEffect(() => {
    if (location.hash) {
      scrollToId(location.hash.replace('#', ''))
    }
  })

  return (
    <main ref={ref} id="wordpress-content-wrapper">
      <link href="/api/wordpress/css" rel="stylesheet" type="text/css" />
      <link
        href={`/hsp-fo-cms.css?=${packageJson.version}`}
        rel="stylesheet"
        type="text/css"
      />
      <div data-testid="cms-index">
        <article className="page type-page status-publish hentry">
          <div className="post-inner thin">
            <div
              className="entry-content"
              dangerouslySetInnerHTML={{
                __html: wordpressPage.content.rendered ?? '',
              }}
            />
          </div>
        </article>
      </div>
    </main>
  )
}
