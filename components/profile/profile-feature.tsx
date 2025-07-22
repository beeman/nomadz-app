import { AppView } from '@/components/app-view'
import * as React from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { ProfileUiHeader } from '@/components/profile/profile-ui-header'
import { Button } from 'react-native-paper'
import { useAppThemeSpacing } from '@/components/use-app-theme-spacing'
import { ScrollView } from 'react-native'
import { AppText } from '@/components/app-text'

export function ProfileFeature() {
  const { user, signOut } = useAuth()
  const spacing = useAppThemeSpacing()
  if (!user) {
    return null
  }
  return (
    <ScrollView>
      <ProfileUiHeader />
      <AppView style={{ padding: spacing.md }}>
        <Button mode="contained-tonal">Edit Profile</Button>
        <Button mode="outlined">Other Option</Button>
        <Button mode="outlined">More Buttons</Button>
        <Button onPress={signOut} mode="outlined">
          Sign Out
        </Button>
      </AppView>
      <AppView style={{ padding: spacing.md }}>
        <AppText style={{ fontFamily: 'Courier' }}>{JSON.stringify(user, null, 2)}</AppText>
      </AppView>
    </ScrollView>
  )
}
