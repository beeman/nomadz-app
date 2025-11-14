import { AppPage } from '@/components/app-page'
import { SearchFeatureIndex } from '@/components/search/search-feature-index'
import { SearchProvider } from '@/components/search/search-provider'
import React from 'react'

export default function TabSearchResults() {
  return (
    <AppPage>
      <SearchProvider>
        <SearchFeatureIndex />
      </SearchProvider>
    </AppPage>
  )
}
