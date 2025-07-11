import { AppView } from '@/components/app-view'
import * as React from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { ProfileUiHeader } from '@/components/profile/profile-ui-header'
import { Button, List } from 'react-native-paper'
import { useAppThemeSpacing } from '@/components/use-app-theme-spacing'

export function ProfileFeature() {
  const { user } = useAuth()
  const spacing = useAppThemeSpacing()
  if (!user) {
    return null
  }
  return (
    <AppView>
      <ProfileUiHeader />
      <AppView style={{ padding: spacing.md }}>
        <Button mode="contained-tonal">Edit Profile</Button>
      </AppView>
      <AppView style={{ padding: spacing.md }}>
        <List.Section>
          <List.Item title={'Foo Bar'} />
        </List.Section>
      </AppView>
    </AppView>
  )
}
