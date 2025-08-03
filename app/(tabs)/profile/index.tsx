import { AppPage } from '@/components/app-page'
import { ProfileFeature } from '@/components/profile/profile-feature'
import React from 'react'

export default function TabsProfileScreen() {
  return (
    <AppPage style={{ padding: 0 }} className="flex flex-col justify-start flex-1">
      <ProfileFeature />
    </AppPage>
  )
}
