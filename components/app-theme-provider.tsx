import { ThemeProvider } from '@react-navigation/native'
import { PropsWithChildren } from 'react'
import { PaperProvider } from 'react-native-paper'
import { useAppTheme } from '@/components/use-app-theme'

export function AppThemeProvider({ children }: PropsWithChildren) {
  const theme = useAppTheme()

  return (
    <PaperProvider theme={theme}>
      <ThemeProvider value={theme}>{children}</ThemeProvider>
    </PaperProvider>
  )
}
