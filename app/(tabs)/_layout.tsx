import { useAuth } from '@/components/auth/auth-provider'
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol'
import { Image } from 'expo-image'
import { Tabs } from 'expo-router'
import React from 'react'

export default function TabLayout() {
  const { user } = useAuth()
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 72,
          paddingBottom: 20,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
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
          tabBarIcon: ({ color }) => <UiIconSymbol size={28} name="map" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) =>
            user?.image ? (
              <Image style={{ height: 28, width: 28, borderRadius: 100 }} source={user.image} />
            ) : (
              <UiIconSymbol size={28} name="person.wave.2.fill" color={color} />
            ),
        }}
      />
    </Tabs>
  )
}
