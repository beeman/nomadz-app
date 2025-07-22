import { useAuth } from '@/components/auth/auth-provider'
import { View } from 'react-native'
import { Image } from 'expo-image'
import { AppText } from '@/components/app-text'
import * as React from 'react'
import { useAppThemeColors } from '@/components/use-app-theme-colors'
import { useAppThemeSpacing } from '@/components/use-app-theme-spacing'
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol'

export function ProfileUiHeader() {
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
        alignItems: 'center',
        gap: spacing.sm,
        paddingTop: spacing.xl,
        paddingBottom: spacing.md,
      }}
    >
      {user?.image && user?.image?.startsWith('http') ? (
        <Image style={{ height: 128, width: 128, borderRadius: 100 }} source={user.image} />
      ) : (
        <UiIconSymbol size={28} name="person.wave.2.fill" color={'red'} />
      )}
      <AppText variant="displaySmall">
        {user?.firstName} {user?.lastName}
      </AppText>
    </View>
  )
}
