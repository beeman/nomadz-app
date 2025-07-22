import { AppView } from '@/components/app-view'
import { AppText } from '@/components/app-text'
import * as React from 'react'
import { useTripsList } from './trips-list-provider'
import { Card } from 'react-native-paper'
import { Link } from 'expo-router'

export function TripsFeatureList() {
  const { items } = useTripsList()
  return (
    <AppView>
      <AppText variant="titleSmall">See your trips here.</AppText>
      {items.map((item, index) => (
        <Link asChild href={`/trips/${item.id}`} key={index}>
          <Card>
            <Card.Content>
              <AppText variant="titleMedium">Trips List page</AppText>
              <AppText>{item.destination}</AppText>
            </Card.Content>
          </Card>
        </Link>
      ))}
    </AppView>
  )
}
