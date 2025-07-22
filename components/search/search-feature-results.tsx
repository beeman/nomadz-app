import { AppView } from '@/components/app-view'
import { AppText } from '@/components/app-text'
import * as React from 'react'

export function SearchFeatureResults() {
  return (
    <AppView>
      <AppText variant="titleMedium">Search Results</AppText>
      <AppText>Search results here.</AppText>
    </AppView>
  )
}
