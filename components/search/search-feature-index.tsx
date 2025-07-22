import { AppView } from '@/components/app-view'
import { AppText } from '@/components/app-text'
import * as React from 'react'
import { useSearch } from './search-provider'
import { Link } from 'expo-router'
import { Card } from 'react-native-paper'

export function SearchFeatureIndex() {
  const { items } = useSearch()
  return (
    <AppView>
      <AppText variant="titleMedium">Search Index</AppText>
      <AppText>Search index blocks here.</AppText>
      {items.map((item, index) => (
        <Link asChild href={`/search/${item.id}`} key={index}>
          <Card>
            <Card.Content>
              <AppText variant="titleMedium">Search Index</AppText>
              <AppText>{item.destination}</AppText>
            </Card.Content>
          </Card>
        </Link>
      ))}
    </AppView>
  )
}
