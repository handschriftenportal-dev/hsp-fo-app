import React, { Suspense } from 'react'
import { Await, useLoaderData } from 'react-router-dom'

import { NormOverview } from 'src/components/authorityFiles'
import { AuthorityFileLoaderProps } from 'src/contexts/loader'
import { useSetupModulesForPage } from 'src/contexts/modules'
import { useTrackPageView } from 'src/contexts/tracking'

export function AuthorityFile() {
  useSetupModulesForPage()
  useTrackPageView('AuthorityFile')

  const { authorityData } = useLoaderData() as AuthorityFileLoaderProps

  return (
    <Suspense fallback={<NormOverview />}>
      <Await resolve={authorityData}>
        <NormOverview />
      </Await>
    </Suspense>
  )
}
