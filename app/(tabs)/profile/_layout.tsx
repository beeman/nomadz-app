import { createHeaderConfig } from '@/components/app-header-config'
import { Stack } from 'expo-router'
import React from 'react'

export default function ProfileLayout() {
  return (
    <Stack screenOptions={createHeaderConfig('Profile')}>
      <Stack.Screen name="index" />
    </Stack>
  )
}
