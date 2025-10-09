import { AppText } from '@/components/app-text'
import React from 'react'
import { View } from 'react-native'

export default function SecuritySettings() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <AppText style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        Security Settings
      </AppText>
      <AppText style={{ color: 'white', fontSize: 16, marginBottom: 8 }}>
        Manage your account security
      </AppText>
      <AppText style={{ color: 'white', fontSize: 14 }}>
        Coming soon...
      </AppText>
    </View>
  )
}
