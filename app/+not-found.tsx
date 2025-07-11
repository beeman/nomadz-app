import { Stack, useRouter } from 'expo-router'
import { AppText } from '@/components/app-text'
import { AppView } from '@/components/app-view'
import { Button } from 'react-native-paper'

import { useAppThemeSpacing } from '@/components/use-app-theme-spacing'

export default function NotFoundScreen() {
  const spacing = useAppThemeSpacing()
  const router = useRouter()

  return (
    <AppView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg }}>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <AppText variant="headlineMedium">This screen does not exist.</AppText>
      <Button mode="contained-tonal" onPressIn={() => router.replace('/')}>
        Go to home screen!
      </Button>
    </AppView>
  )
}
