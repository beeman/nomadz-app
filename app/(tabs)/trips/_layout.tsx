import { createHeaderConfig } from '@/components/app-header-config'
import { Stack } from 'expo-router'
import React from 'react'

export default function TripsLayout() {
  return (
    <Stack screenOptions={createHeaderConfig('Trips')}>
      <Stack.Screen name="index" />
    </Stack>
  )
}
