import { useAppThemeSpacing } from '@/components/use-app-theme-spacing'
import React from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { ApartmentCard } from './apartment-card'
import { useSearch } from './search-provider'

export function SearchResults() {
  const { searchResults, clearSearch, hasMore, loadMore, isLoadMoreLoading } = useSearch()
  const spacing = useAppThemeSpacing()

  if (!searchResults?.length) {
    return null
  }

  const renderItem = ({ item }: { item: any }) => (
    <ApartmentCard apartment={item} />
  )

  const renderFooter = () => {
    if (!hasMore) return null

    return (
      <View style={{ paddingVertical: spacing.lg, alignItems: 'center' }}>
        <TouchableOpacity
          onPress={loadMore}
          disabled={isLoadMoreLoading}
          style={{
            backgroundColor: '#404040',
            borderRadius: 12,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            opacity: isLoadMoreLoading ? 0.5 : 1,
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>
            {isLoadMoreLoading ? 'Loading...' : 'Show More'}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: '#292929',
      }}>
        <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }}>
          {searchResults.length} results found
        </Text>
        <TouchableOpacity onPress={clearSearch}>
          <Text style={{ color: '#A0A0A0', fontSize: 14 }}>
            Clear Search
          </Text>
        </TouchableOpacity>
      </View>

      {/* Results List */}
      <FlatList
        data={searchResults}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.lg }}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
} 