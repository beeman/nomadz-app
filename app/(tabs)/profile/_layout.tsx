import { Stack } from 'expo-router'
import React from 'react'
import { AppView } from '@/components/app-view'

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerTitle: 'Profile', headerRight: () => <AppView /> }}>
      <Stack.Screen name="index" />
    </Stack>
  )
}
