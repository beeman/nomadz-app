import { SearchFeatureIndex } from '@/components/search/search-feature-index'
import { SearchProvider } from '@/components/search/search-provider'
import React from 'react'

export default function SearchTab() {
  return (
    <SearchProvider>
      <SearchFeatureIndex />
    </SearchProvider>
  )
}
