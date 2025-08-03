import { AppText } from '@/components/app-text'
import { AppView } from '@/components/app-view'
import { useAuth } from '@/components/auth/auth-provider'
import { useAppThemeSpacing } from '@/components/use-app-theme-spacing'
import { Image } from 'expo-image'
import * as React from 'react'
import { ScrollView, View } from 'react-native'
import { Button } from 'react-native-paper'

export function ProfileFeature() {
  const { user, signOut } = useAuth()
  const spacing = useAppThemeSpacing()

  if (!user) {
    return null
  }

  return (
    <ScrollView
      contentContainerStyle={{
        padding: spacing.md,
        backgroundColor: '#000', // full dark background
        flexGrow: 1,
        justifyContent: 'flex-start',
      }}
      className="flex flex-col"
    >
      <AppView
        style={{
          backgroundColor: '#0E0E0E',
          borderRadius: 20,
          borderWidth: 1,
          borderColor: '#323232',
          padding: spacing.lg,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
          <Image
            source={user.image}
            style={{
              width: 72,
              height: 72,
              borderRadius: 999,
              borderWidth: 4,
              borderColor: '#404040',
              marginRight: spacing.md,
            }}
          />
          <View style={{ flex: 1 }}>
            <AppText
              style={{
                color: '#fff',
                fontSize: 18,
                fontWeight: '600',
                marginBottom: 4,
              }}
              numberOfLines={1}
            >
              {user.firstName} {user.lastName}
            </AppText>
            {user.bio && (
              <AppText
                style={{
                  color: '#B7B7B7',
                  fontSize: 12,
                  lineHeight: 16,
                }}
                numberOfLines={2}
              >
                {user.bio}
              </AppText>
            )}
          </View>
        </View>

        <View style={{ gap: spacing.sm }}>
          <Button
            mode="contained"
            style={{
              backgroundColor: '#202020',
              borderRadius: 12,
            }}
            labelStyle={{ color: '#fff', fontWeight: '600' }}
            onPress={() => {}}
          >
            Edit Profile
          </Button>
          <Button
            mode="outlined"
            style={{
              borderColor: '#404040',
              borderRadius: 12,
            }}
            labelStyle={{ color: '#fff' }}
            onPress={() => {}}
          >
            Other Option
          </Button>
          <Button
            mode="outlined"
            style={{
              borderColor: '#404040',
              borderRadius: 12,
            }}
            labelStyle={{ color: '#fff' }}
            onPress={() => {}}
          >
            More Buttons
          </Button>
          <Button
            mode="outlined"
            style={{
              borderColor: '#404040',
              borderRadius: 12,
            }}
            labelStyle={{ color: '#fff' }}
            onPress={signOut}
          >
            Sign Out
          </Button>
        </View>
      </AppView>
    </ScrollView>
  )
}
