import { TripsSettingsDetails } from '@/components/settings/trips/trips-settings-details'
import React from 'react'
import { View } from 'react-native'

export default function TripsSettings() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TripsSettingsDetails />
    </View>
  )
}
