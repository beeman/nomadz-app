import { useAppThemeSpacing } from '@/components/use-app-theme-spacing'
import { formatPropertyRegion } from '@/utils/format-property-region'
import { formatPrice, getNightlyPriceWithCommission } from '@/utils/rate-utils'
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

  // Get the lowest price with commission if available
  const getLowestPrice = () => {
    if (!apartment.rates?.[0]) {
      return 0;
    }
    return getNightlyPriceWithCommission(apartment.rates[0]);
  };
  
  const lowestPrice = getLowestPrice();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={{
        backgroundColor: '#1B1B1B',
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: '#292929',
      }}>
        <Card.Cover 
          source={{ uri: apartment.images?.[0]?.url?.replace('{size}', '640x640') }} 
        />
        <Card.Content style={{ padding: spacing.md }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.xs }}>
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', flex: 1, marginRight: spacing.sm }}>
              {apartment.name}
            </Text>
            {!!apartment.rating && (
              <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 0 }}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={{ color: '#FFFFFF', fontSize: 14, marginLeft: spacing.xs }}>
                  {apartment.rating}
                </Text>
                <Text style={{ color: '#A0A0A0', fontSize: 12, marginLeft: spacing.xs }}>
                  ({apartment.reviewsNumber})
                </Text>
              </View>
            )}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: '#A0A0A0', fontSize: 14, flex: 1, marginRight: spacing.sm }}>
              {locationText}
            </Text>
            {!!lowestPrice && (
              <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 0 }}>
                <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>
                  ${formatPrice(lowestPrice)}
                </Text>
                <Text style={{ color: '#A0A0A0', fontSize: 12, marginLeft: spacing.xs }}>
                  / night
                </Text>
              </View>
            )}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  )
} 