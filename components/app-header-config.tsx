import { AppView } from '@/components/app-view'
import { NativeStackNavigationOptions } from '@react-navigation/native-stack'

export const createHeaderConfig = (title: string): NativeStackNavigationOptions => ({
  headerTitle: title,
  headerRight: () => <AppView />,
  headerStyle: {
    backgroundColor: '#000000',
  },
  headerTintColor: '#FFFFFF',
  headerTitleStyle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600' as const,
  },
})

export const createMinimalHeaderConfig = (): NativeStackNavigationOptions => ({
  headerTitle: '',
  headerStyle: {
    backgroundColor: '#000000',
  },
  headerTintColor: '#FFFFFF',
  headerBackTitle: '',
}) 