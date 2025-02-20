import React from 'react'

import { Home as HomeModule } from 'src/components/home/index'
import { useSetMetatag, useSetTitle } from 'src/contexts/Metatags'
import { useTranslation } from 'src/contexts/i18n'
import { useSetupModulesForPage } from 'src/contexts/modules'
import { useTrackPageView } from 'src/contexts/tracking'

export function Home() {
  const { t } = useTranslation()

  useSetupModulesForPage()
  useTrackPageView('Home')

  const title = `Handschriftenportal: ${t('topBar.logoLink')}`
  const desc = t('description')

  useSetTitle(title)
  useSetMetatag({ key: 'name', value: 'description', content: desc })

  return <HomeModule />
}
