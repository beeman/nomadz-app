import React from 'react'
import { View, type ViewProps } from 'react-native'

import { useAppThemeSpacing } from '@/components/use-app-theme-spacing'

export type AppViewProps = ViewProps

export function AppView({ style, ...props }: AppViewProps) {
  const spacing = useAppThemeSpacing()

  return <View style={[{ gap: spacing.sm }, style]} {...props} />
}
