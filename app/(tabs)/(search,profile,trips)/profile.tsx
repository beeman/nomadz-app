import { AppPage } from '@/components/app-page'
import { ProfileFeature } from '@/components/profile/profile-feature'
import React from 'react'

export default function ProfileTab() {
  return (
    <AppPage style={{ padding: 0 }}>
      <ProfileFeature />
    </AppPage>
  )
}
