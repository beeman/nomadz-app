import { Stack } from 'expo-router'
import React from 'react'
import { AppView } from '@/components/app-view'

export default function TripsLayout() {
  return (
    <Stack screenOptions={{ headerTitle: 'Trips', headerRight: () => <AppView /> }}>
      <Stack.Screen name="index" />
    </Stack>
  )
}
