import { AppText } from '@/components/app-text'
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol'
import { router } from 'expo-router'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'

interface BottomTabsProps {
  activeTab?: string
}

export function BottomTabs({ activeTab }: BottomTabsProps) {
  const tabs = [
    {
      id: 'search',
      title: 'Search',
      icon: 'magnifyingglass',
      route: '/(tabs)/search',
    },
    {
      id: 'trips',
      title: 'Trips',
      icon: 'map',
      route: '/(tabs)/trips',
    },
    {
      id: 'profile',
      title: 'Profile',
      icon: 'person',
      route: '/(tabs)/profile',
    },
  ]

  return (
    <View style={{
      backgroundColor: '#000000',
      borderTopWidth: 0,
      height: 72,
      paddingBottom: 20,
      paddingTop: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
    }}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          onPress={() => router.push(tab.route as any)}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}
        >
          <UiIconSymbol 
            size={28} 
            name={tab.icon as any} 
            color={activeTab === tab.id ? '#FFFFFF' : '#9CA3AF'} 
          />
          <AppText style={{
            color: activeTab === tab.id ? '#FFFFFF' : '#9CA3AF',
            fontSize: 12,
            fontWeight: '500',
            marginTop: 4,
          }}>
            {tab.title}
          </AppText>
        </TouchableOpacity>
      ))}
    </View>
  )
}

BottomTabs.displayName = 'BottomTabs'
