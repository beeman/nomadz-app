import { AppText } from '@/components/app-text'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'

interface TabItem {
  id: string
  label: string
}

interface TopTabsProps {
  tabs: TabItem[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export function TopTabs({ tabs, activeTab, onTabChange }: TopTabsProps) {
  return (
    <View style={{
      flexDirection: 'row',
      backgroundColor: '#000000',
      borderBottomWidth: 1,
      borderBottomColor: '#2F2F2F',
      paddingHorizontal: 16,
    }}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          onPress={() => onTabChange(tab.id)}
          style={{
            flex: 1,
            paddingVertical: 16,
            alignItems: 'center',
            borderBottomWidth: activeTab === tab.id ? 2 : 0,
            borderBottomColor: activeTab === tab.id ? '#FFFFFF' : 'transparent',
          }}
        >
          <AppText style={{
            color: activeTab === tab.id ? '#FFFFFF' : '#9CA3AF',
            fontSize: 14,
            fontWeight: activeTab === tab.id ? '600' : '400',
          }}>
            {tab.label}
          </AppText>
        </TouchableOpacity>
      ))}
    </View>
  )
}

TopTabs.displayName = 'TopTabs'
