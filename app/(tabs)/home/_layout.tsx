import { Stack } from 'expo-router'
import React from 'react'
import { AppView } from '@/components/app-view'

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerTitle: 'Demo', headerRight: () => <AppView /> }}>
      <Stack.Screen name="demo" />
    </Stack>
  )
}
