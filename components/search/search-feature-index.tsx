import { useAppThemeSpacing } from '@/components/use-app-theme-spacing'
import { Ionicons } from '@expo/vector-icons'
import { Link } from 'expo-router'
import * as React from 'react'
import { Alert, FlatList, Text, View } from 'react-native'
import { Card } from 'react-native-paper'
import { SearchBar } from './search-bar'
import { SearchModal } from './search-modal'
import { useSearch } from './search-provider'
import { SearchResults } from './search-results'

export function SearchFeatureIndex() {
  const { 
    random: items, 
    searchResults, 
    isLoading, 
    searchError 
  } = useSearch()
  const spacing = useAppThemeSpacing()

  React.useEffect(() => {
    if (searchError) {
      Alert.alert('Search Error', searchError)
    }
  }, [searchError])

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <SearchBar />
      <SearchModal />
      
      {searchResults ? (
        <SearchResults />
      ) : (
        <FlatList
          style={{ padding: spacing.md }}
          data={items}
          ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
          renderItem={({ item }) => (
            <Link asChild href={`/search/${item.id}`}>
              <Card style={{ 
                backgroundColor: '#151515', 
                borderWidth: 1,
                borderColor: '#292929',
                borderRadius: 12,
                overflow: 'hidden'
              }}>
                <Card.Cover 
                  resizeMode="cover" 
                  source={{ uri: item.images?.[0]?.url?.replace('{size}', '1024x768') }} 
                  style={{ height: 200 }}
                />
                <Card.Title 
                  title={item.name} 
                  titleStyle={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}
                  subtitle={item.region?.countryName ?? 'Unknown'} 
                  subtitleStyle={{ color: '#A0A0A0', fontSize: 14 }}
                  titleNumberOfLines={2}
                  subtitleNumberOfLines={1}
                />
                {!!item.rating && (
                  <View style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    paddingHorizontal: spacing.md,
                    paddingBottom: spacing.sm 
                  }}>
                    <Ionicons name="star" size={16} color="#FFD700" style={{ marginRight: spacing.xs }} />
                    <Text style={{ color: '#FFFFFF', fontSize: 14 }}>
                      {item.rating} ({item.reviewsNumber} reviews)
                    </Text>
                  </View>
                )}
              </Card>
            </Link>
          )}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View style={{ 
              flex: 1, 
              justifyContent: 'center', 
              alignItems: 'center',
              paddingVertical: spacing.xl 
            }}>
              <Text style={{ color: '#FFFFFF', fontSize: 16, textAlign: 'center' }}>
                No properties available
              </Text>
            </View>
          }
        />
      )}
    </View>
  )
}
