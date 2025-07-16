import { useAuth } from '@/components/auth/auth-provider'
import { AppText } from '@/components/app-text'
import { AppView } from '@/components/app-view'
import { AppConfig } from '@/constants/app-config'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ActivityIndicator, View } from 'react-native'
import { Image } from 'expo-image'
import { Button } from '@react-navigation/elements'

export default function SignIn() {
  const { isLoading, signIn } = useAuth()
  return (
    <AppView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
      }}
    >
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <SafeAreaView style={{ flex: 1, justifyContent: 'space-between' }}>
          {/* Dummy view to push the next view to the center. */}
          <View />
          <View style={{ alignItems: 'center', gap: 16 }}>
            <Image source={AppConfig.logo} style={{ width: 128, height: 128 }} />
            <AppText variant="headlineMedium">Welcome to {AppConfig.name}</AppText>
          </View>
          <View style={{ marginBottom: 32 }}>
            <Button variant="filled" style={{ marginHorizontal: 16 }} onPress={() => signIn()}>
              Login
            </Button>
          </View>
        </SafeAreaView>
      )}
    </AppView>
  )
}
