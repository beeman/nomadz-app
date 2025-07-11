import { useColorScheme } from '@/hooks/use-color-scheme'
import { DarkTheme as reactNavigationDark, DefaultTheme as reactNavigationLight } from '@react-navigation/native'
import { adaptNavigationTheme, MD3DarkTheme, MD3LightTheme } from 'react-native-paper'
import merge from 'deepmerge'

const { LightTheme, DarkTheme } = adaptNavigationTheme({ reactNavigationLight, reactNavigationDark })

const AppThemeLight = merge(MD3LightTheme, LightTheme)
const AppThemeDark = merge(MD3DarkTheme, DarkTheme)

export function useAppTheme() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  return isDark ? AppThemeDark : AppThemeLight
}
