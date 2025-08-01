import { useAppThemeSpacing } from '@/components/use-app-theme-spacing'
import { Ionicons } from '@expo/vector-icons'
import { Link } from 'expo-router'
import React from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { Card } from 'react-native-paper'
import { useSearch } from './search-provider'

export function SearchResults() {
  const { searchResults, isLoading, searchError, clearSearch } = useSearch()
  const spacing = useAppThemeSpacing()

  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: spacing.md 
      }}>
        <Text style={{ color: '#FFFFFF', fontSize: 16 }}>
          Searching for your perfect stay...
        </Text>
      </View>
    )
  }

//   if (searchError) {
//     return (
//       <View style={{ 
//         flex: 1, 
//         justifyContent: 'center', 
//         alignItems: 'center',
//         padding: spacing.md 
//       }}>
//         <View style={{ alignItems: 'center' }}>
//           <Ionicons name="alert-circle" size={48} color="#FF6B6B" />
//         </View>
//         <Text style={{ color: '#FFFFFF', fontSize: 16, marginTop: spacing.md, textAlign: 'center' }}>
//           {searchError}
//         </Text>
//         <TouchableOpacity
//           onPress={clearSearch}
//           style={{
//             marginTop: spacing.md,
//             paddingHorizontal: spacing.md,
//             paddingVertical: spacing.sm,
//             backgroundColor: '#404040',
//             borderRadius: 8,
//           }}
//         >
//           <Text style={{ color: '#FFFFFF' }}>Clear Search</Text>
//         </TouchableOpacity>
//       </View>
//     )
//   }

//   if (!searchResults || searchResults.length === 0) {
//     return (
//       <View style={{ 
//         flex: 1, 
//         justifyContent: 'center', 
//         alignItems: 'center',
//         padding: spacing.md 
//       }}>
//         <View style={{ alignItems: 'center' }}>
//           <Ionicons name="search" size={48} color="#A0A0A0" />
//         </View>
//         <Text style={{ color: '#FFFFFF', fontSize: 16, marginTop: spacing.md, textAlign: 'center' }}>
//           No results found
//         </Text>
//         <Text style={{ color: '#A0A0A0', fontSize: 14, marginTop: spacing.sm, textAlign: 'center' }}>
//           Try adjusting your search criteria
//         </Text>
//         <TouchableOpacity
//           onPress={clearSearch}
//           style={{
//             marginTop: spacing.md,
//             paddingHorizontal: spacing.md,
//             paddingVertical: spacing.sm,
//             backgroundColor: '#404040',
//             borderRadius: 8,
//           }}
//         >
//           <Text style={{ color: '#FFFFFF' }}>Clear Search</Text>
//         </TouchableOpacity>
//       </View>
//     )
//   }

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <View style={{ 
        paddingHorizontal: spacing.lg, 
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: '#292929',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#000000',
      }}>
        <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }}>
          {searchResults?.length || 0} properties found
        </Text>
        <TouchableOpacity
          onPress={clearSearch}
          style={{
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.xs,
            backgroundColor: '#404040',
            borderRadius: 6,
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 12 }}>Clear</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        style={{ padding: spacing.md }}
        data={searchResults}
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
                  <Text style={{ color: '#FFFFFF', marginLeft: spacing.xs }}>
                    {item.rating} ({item.reviewsNumber} reviews)
                  </Text>
                </View>
              )}
            </Card>
          </Link>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  )
} 