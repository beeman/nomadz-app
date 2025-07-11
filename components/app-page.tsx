import React, { PropsWithChildren } from 'react'
import { AppView, AppViewProps } from '@/components/app-view'

import { useAppThemeSpacing } from '@/components/use-app-theme-spacing'

export function AppPage({ children, ...props }: PropsWithChildren<AppViewProps>) {
  const spacing = useAppThemeSpacing()
  return (
    <AppView style={{ flex: 1, gap: spacing.md, padding: spacing.md }} {...props}>
      {children}
    </AppView>
  )
}
