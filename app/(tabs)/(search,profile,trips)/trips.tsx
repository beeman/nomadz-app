import { AppPage } from '@/components/app-page'
import { TripsFeatureList } from '@/components/trips/trips-feature-list'
import { TripsListProvider } from '@/components/trips/trips-list-provider'
import React from 'react'

export default function TripsTab() {
  return (
    <AppPage>
      <TripsListProvider>
        <TripsFeatureList />
      </TripsListProvider>
    </AppPage>
  )
}
