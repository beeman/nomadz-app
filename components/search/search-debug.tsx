import { useAppThemeSpacing } from '@/components/use-app-theme-spacing'
import React from 'react'
import { ScrollView, Text } from 'react-native'
import { useSearch } from './search-provider'

export function SearchDebug() {
  const { searchParams, filters, searchError, isLoading } = useSearch()
  const spacing = useAppThemeSpacing()

  return (
    <ScrollView style={{ 
      backgroundColor: '#151515', 
      padding: spacing.md,
      margin: spacing.md,
      borderRadius: 8,
      maxHeight: 200,
      borderWidth: 1,
      borderColor: '#292929',
    }}>
      <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 'bold', marginBottom: spacing.sm }}>
        Debug Info
      </Text>
      
      <Text style={{ color: '#A0A0A0', fontSize: 10, marginBottom: spacing.xs }}>
        Search Params:
      </Text>
      <Text style={{ color: '#FFFFFF', fontSize: 8, marginBottom: spacing.sm }}>
        {JSON.stringify(searchParams, null, 2)}
      </Text>
      
      <Text style={{ color: '#A0A0A0', fontSize: 10, marginBottom: spacing.xs }}>
        Filters:
      </Text>
      <Text style={{ color: '#FFFFFF', fontSize: 8, marginBottom: spacing.sm }}>
        {JSON.stringify(filters, null, 2)}
      </Text>
      
      {searchError && (
        <>
          <Text style={{ color: '#FF6B6B', fontSize: 10, marginBottom: spacing.xs }}>
            Error:
          </Text>
          <Text style={{ color: '#FF6B6B', fontSize: 8 }}>
            {searchError}
          </Text>
        </>
      )}
      
      {isLoading && (
        <Text style={{ color: '#FFD700', fontSize: 10, marginTop: spacing.sm }}>
          Loading...
        </Text>
      )}
    </ScrollView>
  )
} 