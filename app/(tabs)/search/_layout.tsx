import { createHeaderConfig } from '@/components/app-header-config'
import { Stack } from 'expo-router'
import React from 'react'

export default function SearchLayout() {
  return (
    <Stack screenOptions={createHeaderConfig('Search')}>
      <Stack.Screen name="index" />
    </Stack>
  )
}
