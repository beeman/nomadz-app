import { useAppThemeSpacing } from '@/components/use-app-theme-spacing'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { Card } from 'react-native-paper'
import { useSearch } from './search-provider'

export function SearchResults() {
  const { searchResults, clearSearch, hasMore, loadMore, isLoadMoreLoading } = useSearch()
  const spacing = useAppThemeSpacing()

  if (!searchResults?.length) {
    return null
  }

  const renderItem = ({ item }: { item: any }) => (
    <Card style={{
      backgroundColor: '#1B1B1B',
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: '#292929',
    }}>
      <Card.Cover source={{ uri: item.images?.[0]?.url?.replace('{size}', '1024x768') }}  />
      <Card.Content style={{ padding: spacing.md }}>
        <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginBottom: spacing.xs }}>
          {item.name}
        </Text>
        <Text style={{ color: '#A0A0A0', fontSize: 14, marginBottom: spacing.xs }}>
          {item.address}
        </Text>
        {
          !!item.rating &&
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: spacing.md }}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={{ color: '#FFFFFF', fontSize: 14, marginLeft: spacing.xs }}>
                {item.rating}
                </Text>
              </View>
              <Text style={{ color: '#A0A0A0', fontSize: 12 }}>
                ({item.reviewsNumber} reviews)
              </Text>
          </View>
        }
      </Card.Content>
    </Card>
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