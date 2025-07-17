import { Tabs } from 'expo-router'
import React from 'react'
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol'
import { Image } from 'expo-image'
import { useAuth } from '@/components/auth/auth-provider'

export default function TabLayout() {
  const { user } = useAuth()
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      {/* The index redirects to the account screen */}
      <Tabs.Screen name="index" options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <UiIconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <UiIconSymbol size={28} name="gearshape.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="demo"
        options={{
          title: 'Demo',
          tabBarIcon: ({ color }) => <UiIconSymbol size={28} name="ladybug.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) =>
            user?.avatar ? (
              <Image style={{ height: 28, width: 28, borderRadius: 100 }} source={user.avatar} />
            ) : (
              <UiIconSymbol size={28} name="person.wave.2.fill" color={color} />
            ),
        }}
      />
    </Tabs>
  )
}
