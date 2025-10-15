import { createMinimalHeaderConfig } from '@/components/app-header-config'
import { AppProviders } from '@/components/app-providers'
import { AppSplashController } from '@/components/app-splash-controller'
import { useAuth } from '@/components/auth/auth-provider'
import { useTrackLocations } from '@/hooks/use-track-locations'
import {
  Epilogue_100Thin,
  Epilogue_200ExtraLight,
  Epilogue_300Light,
  Epilogue_400Regular,
  Epilogue_500Medium,
  Epilogue_600SemiBold,
  Epilogue_700Bold,
  Epilogue_800ExtraBold,
  Epilogue_900Black,
} from '@expo-google-fonts/epilogue'
import {
  Geist_100Thin,
  Geist_200ExtraLight,
  Geist_300Light,
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
  Geist_800ExtraBold,
  Geist_900Black,
} from '@expo-google-fonts/geist'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import React, { useCallback } from 'react'
import { View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-reanimated'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  // Use this hook to track the locations for analytics or debugging.
  // Delete if you don't need it.
  useTrackLocations((pathname, params) => {
    console.log(`Track ${pathname}`, { params })
  })

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Epilogue_100Thin,
    Epilogue_200ExtraLight,
    Epilogue_300Light,
    Epilogue_400Regular,
    Epilogue_500Medium,
    Epilogue_600SemiBold,
    Epilogue_700Bold,
    Epilogue_800ExtraBold,
    Epilogue_900Black,
    Geist_100Thin,
    Geist_200ExtraLight,
    Geist_300Light,
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
    Geist_800ExtraBold,
    Geist_900Black,
  })

  const onLayoutRootView = useCallback(async () => {
    console.log('onLayoutRootView')
    if (loaded) {
      console.log('loaded')
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    // Async font loading only occurs in development.
    return null
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <AppProviders>
          <AppSplashController />
          <RootNavigator />
          <StatusBar style="auto" />
        </AppProviders>
      </View>
    </GestureHandlerRootView>
  )
}

function RootNavigator() {
  const { isAuthenticated } = useAuth()
  return (
    <Stack screenOptions={createMinimalHeaderConfig()}>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="settings/index" />
        <Stack.Screen name="user/[id]" />
        <Stack.Screen name="+not-found" />
      </Stack.Protected>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
    </Stack>
  )
}
