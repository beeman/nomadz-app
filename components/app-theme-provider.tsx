import { ThemeProvider } from '@react-navigation/native'
import { PropsWithChildren } from 'react'
import { PaperProvider } from 'react-native-paper'
import { useAppTheme } from '@/components/use-app-theme'
import { PrivyElements } from '@privy-io/expo/ui'

export function AppThemeProvider({ children }: PropsWithChildren) {
  const theme = useAppTheme()

  return (
    <PaperProvider theme={theme}>
      <ThemeProvider value={theme}>{children}</ThemeProvider>
      <PrivyElements config={{ appearance: { colorScheme: theme.dark ? 'dark' : 'light' } }} />
    </PaperProvider>
  )
}
