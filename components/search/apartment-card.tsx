import { useAppThemeSpacing } from '@/components/use-app-theme-spacing'
import { formatPropertyRegion } from '@/utils/format-property-region'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { Card } from 'react-native-paper'
import { Result } from './search-provider'

interface ApartmentCardProps {
  apartment: Result
  onPress?: () => void
  showRegion?: boolean // If true, shows city, country. If false, shows address
}

export function ApartmentCard({ apartment, onPress, showRegion = false }: ApartmentCardProps) {
  const spacing = useAppThemeSpacing()

  const locationText = showRegion 
    ? formatPropertyRegion([apartment.region?.name, apartment.region?.countryName])
    : apartment.address

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={{
        backgroundColor: '#1B1B1B',
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: '#292929',
      }}>
        <Card.Cover 
          source={{ uri: apartment.images?.[0]?.url?.replace('{size}', '1024x768') }} 
        />
        <Card.Content style={{ padding: spacing.md }}>
          <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginBottom: spacing.xs }}>
            {apartment.name}
          </Text>
          <Text style={{ color: '#A0A0A0', fontSize: 14, marginBottom: spacing.xs }}>
            {locationText}
          </Text>
          {!!apartment.rating && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: spacing.md }}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={{ color: '#FFFFFF', fontSize: 14, marginLeft: spacing.xs }}>
                  {apartment.rating}
                </Text>
              </View>
              <Text style={{ color: '#A0A0A0', fontSize: 12 }}>
                ({apartment.reviewsNumber} reviews)
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  )
} 