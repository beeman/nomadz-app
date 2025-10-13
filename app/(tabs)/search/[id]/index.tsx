import { GuestsProvider } from '@/components/guests/guests-provider'
import { SearchFeatureDetails } from '@/components/search/search-feature-details'
import { SearchProvider } from '@/components/search/single-property-search-provider'
import React from 'react'

export default function ApartmentScreen() {
  return (
    <GuestsProvider>
      <SearchProvider>
        <SearchFeatureDetails />
      </SearchProvider>
    </GuestsProvider>
  )
}
