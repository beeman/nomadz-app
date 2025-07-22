import { Stack } from 'expo-router'
import React from 'react'
import { AppView } from '@/components/app-view'

export default function SearchLayout() {
  return (
    <Stack screenOptions={{ headerTitle: 'Search', headerRight: () => <AppView /> }}>
      <Stack.Screen name="index" />
    </Stack>
  )
}
