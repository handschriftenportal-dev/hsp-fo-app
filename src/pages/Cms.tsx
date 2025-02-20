import React, { Suspense } from 'react'
import { Await, useLoaderData } from 'react-router-dom'

import { Cms as CmsModule } from 'src/components/cms/index'
import { CMSLoaderDataProps } from 'src/contexts/loader'
import { useSetupModulesForPage } from 'src/contexts/modules'
import { useTrackPageView } from 'src/contexts/tracking'

export function Cms() {
  useSetupModulesForPage()

  useTrackPageView('Cms')

  const { page } = useLoaderData() as CMSLoaderDataProps

  return (
    <Suspense fallback={null}>
      <Await resolve={page}>
        <CmsModule />
      </Await>
    </Suspense>
  )
}
