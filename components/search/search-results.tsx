import { useAppThemeSpacing } from '@/components/use-app-theme-spacing'
import { useRoute } from '@react-navigation/native'
import { useRouter } from 'expo-router'
import qs from 'qs'
import React from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { ApartmentCard } from './apartment-card'
import { useSearch } from './search-provider'

export function SearchResults() {
  const { searchResults, clearSearch, hasMore, loadMore, isLoadMoreLoading } = useSearch()
  const spacing = useAppThemeSpacing()
  const router = useRouter()
  const route = useRoute()
  const { searchParams } = useSearch()

  if (!searchResults?.length) {
    return null
  }

  const renderItem = ({ item }: { item: any }) => (
    <ApartmentCard
      onPress={() => router.navigate(`/search/${item.hid}?${qs.stringify(searchParams)}`)}
      apartment={item}
    />
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
