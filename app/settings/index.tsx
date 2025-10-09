import { BottomTabs } from '@/components/ui/bottom-tabs'
import { TopTabs } from '@/components/ui/top-tabs'
import React, { useState } from 'react'
import { View } from 'react-native'
import PaymentsSettings from './payments'
import ProfileSettings from './profile'
import SecuritySettings from './security'
import TripsSettings from './trips'

const tabs = [
  { id: 'profile', label: 'Profile' },
  { id: 'security', label: 'Security' },
  { id: 'payments', label: 'Payments' },
  { id: 'trips', label: 'Trips' },
]

export default function SettingsIndex() {
  const [activeTab, setActiveTab] = useState('profile')

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />
      case 'security':
        return <SecuritySettings />
      case 'payments':
        return <PaymentsSettings />
      case 'trips':
        return <TripsSettings />
      default:
        return <ProfileSettings />
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <TopTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <View style={{ flex: 1 }}>
        {renderContent()}
      </View>
      <BottomTabs />
    </View>
  )
}
