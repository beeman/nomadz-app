import { AppView } from '@/components/app-view'
import * as React from 'react'
import { useSearch } from './search-provider'
import { Link } from 'expo-router'
import { Card } from 'react-native-paper'

export function SearchFeatureIndex() {
  const { random } = useSearch()
  return (
    <AppView>
      {random?.map((item, index) => (
        <Link asChild href={`/search/${item.id}`} key={index}>
          <Card>
            <Card.Title title={item.name} subtitle={item.region?.countryName ?? 'Unknown'} />
            <Card.Cover source={{ uri: item.images[0].url?.replace('{size}', '80x80') }} />
          </Card>
        </Link>
      ))}
    </AppView>
  )
}
