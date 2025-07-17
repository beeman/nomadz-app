import { AppView } from '@/components/app-view'
import { AppText } from '@/components/app-text'
import * as React from 'react'

export function HomeFeature() {
  return (
    <AppView>
      <AppText variant="titleMedium">Home page</AppText>
      <AppText>Start building your features here.</AppText>
    </AppView>
  )
}
