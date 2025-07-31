import { useAuth } from '@/components/auth/auth-provider'
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol'
import { Tabs } from 'expo-router'
import React from 'react'

export default function TabLayout() {
  const { user } = useAuth()
  
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      {/* The index redirects to the account screen */}
      <Tabs.Screen name="index" options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <UiIconSymbol size={28} name="magnifyingglass" color={color} />,
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: 'Trips',
          tabBarIcon: ({ color }) => <UiIconSymbol size={28} name="bed.double.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <UiIconSymbol size={28} name="gearshape.fill" color={color} />,
        }}
      />
    </Tabs>
  )
}
