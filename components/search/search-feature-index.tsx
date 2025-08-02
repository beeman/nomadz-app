import { useAppThemeSpacing } from '@/components/use-app-theme-spacing'
import React from 'react'
import { FlatList, Text, View } from 'react-native'
import { ApartmentCard } from './apartment-card'
import { SearchBar } from './search-bar'
import { SearchModal } from './search-modal'
import { useSearch } from './search-provider'
import { SearchResults } from './search-results'

export function SearchFeatureIndex() {
  const { random, searchResults, isLoading, searchError, isLoadMoreLoading } = useSearch()
  const spacing = useAppThemeSpacing()

  const renderRandomItem = ({ item }: { item: any }) => (
    <ApartmentCard apartment={item} showRegion={true} />
  )

  // Only show loading screen for initial load, not for load more
  if (isLoading && !isLoadMoreLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#000000',
        padding: spacing.md 
      }}>
        <Text style={{ color: '#FFFFFF', fontSize: 16 }}>
          Loading properties...
        </Text>
      </View>
    )
  }

  if (searchError) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#000000',
        padding: spacing.md 
      }}>
        <Text style={{ color: '#FF6B6B', fontSize: 16, textAlign: 'center' }}>
          {searchError}
        </Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <SearchBar />
      <SearchModal />
      
      {searchResults ? (
        <SearchResults />
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            data={random}
            renderItem={renderRandomItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: spacing.lg }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  )
}
