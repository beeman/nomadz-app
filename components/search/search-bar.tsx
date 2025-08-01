import { useAppThemeSpacing } from '@/components/use-app-theme-spacing'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useSearch } from './search-provider'

export function SearchBar() {
  const { openSearchModal, searchParams } = useSearch()
  const spacing = useAppThemeSpacing()

  const getDestinationText = () => {
    if (searchParams.regionId) {
      return 'Kyiv, Ukraine' // Hardcoded for now
    }
    return "what's your destination?"
  }

  return (
    <View style={{ 
      paddingHorizontal: spacing.md, 
      paddingVertical: spacing.md,
      backgroundColor: '#000000'
    }}>
      <TouchableOpacity
        onPress={openSearchModal}
        style={{
          backgroundColor: '#000000',
          borderWidth: 1,
          borderColor: '#404040',
          borderRadius: 25,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          flexDirection: 'row',
          alignItems: 'center',
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <Ionicons name="sparkles" size={18} color="#FFFFFF" style={{ marginRight: spacing.md }} />
        <Text style={{ color: '#A0A0A0', fontSize: 16, flex: 1 }}>
          {getDestinationText()}
        </Text>
      </TouchableOpacity>
    </View>
  )
} 