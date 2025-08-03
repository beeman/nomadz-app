import { useAppThemeSpacing } from '@/components/use-app-theme-spacing'
import { Link } from 'expo-router'
import * as React from 'react'
import { FlatList, View } from 'react-native'
import { Card } from 'react-native-paper'
import { useSearch } from './search-provider'

export function SearchFeatureIndex() {
  const { random: items } = useSearch()
  const spacing = useAppThemeSpacing()

  return (
    <FlatList
      style={{ padding: spacing.md }}
      data={items}
      ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
      renderItem={({ item }) => (
        <Link
          asChild
          key={item.id}
          href={`/search/8473727?checkin=2025-08-08&checkout=2025-08-10&guests%5Badults%5D=1`}
        >
          <Card>
            <Card.Title title={item.name} subtitle={item.region?.countryName ?? 'Unknown'} />
            <Card.Cover
              resizeMode="cover"
              source={{ uri: item?.images?.[0]?.url?.replace('{size}', '1024x768') || '' }}
            />
          </Card>
        </Link>
      )}
      keyExtractor={(item) => item.id}
    />
  )
}
