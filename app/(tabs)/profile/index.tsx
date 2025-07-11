import React from 'react'
import { AppPage } from '@/components/app-page'
import { ProfileFeature } from '@/components/profile/profile-feature'

export default function TabsProfileScreen() {
  return (
    <AppPage style={{ padding: 0 }}>
      <ProfileFeature />
    </AppPage>
  )
}
