import { useAuth } from '@/components/auth/auth-provider'
import { View } from 'react-native'
import { Image } from 'expo-image'
import { AppText } from '@/components/app-text'
import * as React from 'react'
import { useAppThemeColors } from '@/components/use-app-theme-colors'
import { useAppThemeSpacing } from '@/components/use-app-theme-spacing'

export function ProfileUiHeaderRow() {
  const { user } = useAuth()
  const colors = useAppThemeColors()
  const spacing = useAppThemeSpacing()

  if (!user) {
    return null
  }
  return (
    <View
      style={{
        backgroundColor: colors.surfaceVariant,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        padding: spacing.md,
      }}
    >
      <Image style={{ height: 36, width: 36, borderRadius: 50 }} source={user.avatar} />
      <AppText variant="titleLarge">{user?.name}</AppText>
    </View>
  )
}
