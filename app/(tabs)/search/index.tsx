import React from 'react'
import { AppPage } from '@/components/app-page'
import { SearchFeatureIndex } from '@/components/search/search-feature-index'
import { SearchProvider } from '@/components/search/search-provider'

export default function TabSearchIndex() {
  return (
    <AppPage>
      <SearchProvider>
        <SearchFeatureIndex />
      </SearchProvider>
    </AppPage>
  )
}
