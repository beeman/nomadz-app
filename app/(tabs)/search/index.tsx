import React from 'react'
import { SearchProvider } from '@/components/search/search-provider'
import { SearchFeatureIndex } from '@/components/search/search-feature-index'

export default function TabSearchIndex() {
  return (
    <SearchProvider>
      <SearchFeatureIndex />
    </SearchProvider>
  )
}
