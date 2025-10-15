import { createMinimalHeaderConfig } from '@/components/app-header-config'
import { Stack } from "expo-router"
import React from "react"

export default function GroupLayout() {
  return (
    <Stack>
      {/* Tab screens */}
      <Stack.Screen name="search" options={{ title: 'Search', headerShown: false }} />
      <Stack.Screen name="profile" options={{ title: 'Profile', headerShown: false }} />
      <Stack.Screen name="trips" options={{ title: 'Trips', headerShown: false }} />
      
      {/* Search tab screens */}
      <Stack.Screen name="search-results" options={createMinimalHeaderConfig()} />
      <Stack.Screen name="search/[id]" options={createMinimalHeaderConfig()} />
      
      {/* Trips tab screens */}
      <Stack.Screen name="trip-details" options={createMinimalHeaderConfig()} />
      
      {/* Shared screens */}
      <Stack.Screen name="user/[id]" options={createMinimalHeaderConfig()} />
    </Stack>
  )
}