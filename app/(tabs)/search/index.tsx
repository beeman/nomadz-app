import React from 'react'
import { SearchFeatureIndex } from '@/components/search/search-feature-index'
import { SearchProvider } from '@/components/search/search-provider'

export default function TabSearchIndex() {
  return (
    <SearchProvider>
      <SearchFeatureIndex />
    </SearchProvider>
  )
}
