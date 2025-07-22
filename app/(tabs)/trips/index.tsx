import React from 'react'
import { AppPage } from '@/components/app-page'
import { TripsFeatureList } from '@/components/trips/trips-feature-list'
import { TripsListProvider } from '@/components/trips/trips-list-provider'

export default function TabTripsIndex() {
  return (
    <AppPage>
      <TripsListProvider>
        <TripsFeatureList />
      </TripsListProvider>
    </AppPage>
  )
}
