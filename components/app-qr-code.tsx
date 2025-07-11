import React from 'react'
import QRCode from 'react-qr-code'
import { AppView, AppViewProps } from '@/components/app-view'

import { useAppThemeSpacing } from '@/components/use-app-theme-spacing'

export function AppQrCode({ value, ...props }: AppViewProps & { value: string }) {
  const spacing = useAppThemeSpacing()
  return (
    <AppView style={{ backgroundColor: 'white', marginHorizontal: 'auto', padding: spacing.md }} {...props}>
      <QRCode value={value} />
    </AppView>
  )
}
