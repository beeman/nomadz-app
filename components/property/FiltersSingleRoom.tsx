import { LoadingIcon } from '@/components/icons/Icons'
import { Link } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'
import { DatePickerComponent, DateRange } from '../search/date-picker'
import { GuestsInput } from '../search/guests-input'
import { useAppThemeSpacing } from '../use-app-theme-spacing'

interface FiltersSingleRoomProps {
  dateRange: DateRange
  guests: {
    adults: number
    children: number[]
  }
  onDateRangeChange: (newDateRange: DateRange) => void
  onGuestsChange: (newGuests: { adults: number; children: number[] }) => void
  isAuthenticated: boolean
  isLoading: boolean
  selectedRate: any
  onBookNow: () => void
  isBookingEnabled: boolean
  showBookingDetails: boolean
}

export default function FiltersSingleRoom({
  dateRange,
  guests,
  onDateRangeChange,
  onGuestsChange,
  isAuthenticated,
  isLoading,
  selectedRate,
  onBookNow,
  isBookingEnabled,
  showBookingDetails,
}: FiltersSingleRoomProps) {
  const spacing = useAppThemeSpacing()

  // Convert guests to internal format for GuestsInput
  const parseGuestsFromParams = (guests: any) => {    
    // Handle already parsed guests object
    const adults = Number(guests.adults) || 1
    const children = Array.isArray(guests.children) ? guests.children : []
    
    // Convert to internal format for GuestsInput
    const internalChildren = children.filter((age: number) => age >= 2) // Only children 2+ years
    const infants = children.filter((age: number) => age === 1).length // Count infants (age 1)

    return {
      adults,
      children: internalChildren,
      infants,
    }
  }

  // Convert external guests format to internal format for GuestsInput
  const internalGuests = parseGuestsFromParams(guests)

  // Convert internal guests format back to external format
  const handleInternalGuestsChange = (internalGuests: { adults: number; children: number[]; infants: number }) => {
    const children = [
      ...internalGuests.children.map(() => 12), // Default children age 12
      ...Array(internalGuests.infants).fill(1), // Infants age 1
    ]
    onGuestsChange({
      adults: internalGuests.adults,
      children,
    })
  }

  return (
    <View style={{ flex: 1, borderRadius: 12, padding: showBookingDetails ? 24 : 0, backgroundColor: showBookingDetails ? '#161616' : 'transparent' }}>
      <View style={{
        flexDirection: 'row',
        gap: spacing.sm,
        alignItems: 'center',
      }}>
        <View style={{ flex: 2 }}>
          <DatePickerComponent
            value={dateRange}
            onChange={onDateRangeChange}
          />
        </View>
        <View style={{ flex: 1 }}>
          <GuestsInput
            guests={internalGuests}
            onGuestsChange={handleInternalGuestsChange}
          />
        </View>
      </View>

      {showBookingDetails && (
        <>
          {!isAuthenticated ? (
            <View style={{ paddingVertical: 16, alignItems: 'center' }}>
              <Text style={{ color: '#A9A9A9', marginBottom: 8 }}>please, log in to book this property</Text>
              <Link
                href={`/sign-in?redirect_to=${encodeURIComponent(window.location.href)}`}
                style={{ color: '#FFFFFF', textDecorationLine: 'underline' }}
                target="_blank"
                rel="noopener noreferrer"
              >
                log in
              </Link>
            </View>
          ) : (
            <View
              onTouchStart={() => {
                if (isBookingEnabled) {
                  onBookNow()
                }
              }}
              style={{
                width: '100%',
                borderRadius: 14,
                paddingVertical: 8,
                alignItems: 'center',
                borderWidth: isLoading || !selectedRate ? 2 : 0,
                borderColor: isLoading || !selectedRate ? 'rgba(255, 255, 255, 0.4)' : 'transparent',
                backgroundColor: isLoading || !selectedRate ? 'transparent' : '#404040',
              }}
            >
              <Text style={{ 
                color: isBookingEnabled ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)', 
                fontSize: 18, 
                fontWeight: '500' 
              }}>
                book now
              </Text>
            </View>
          )}

          {isLoading ? (
            <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 16 }}>
              <LoadingIcon className="animate-spin" width={32} height={32} />
            </View>
          ) : selectedRate ? (
            <View style={{ marginTop: 24, gap: 8 }}>
              <View style={{ maxHeight: 128, gap: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#A9A9A9' }}>base price</Text>
                  <Text style={{ color: '#FFFFFF' }}>
                    {selectedRate.payment_options?.payment_types?.[0]?.show_amount_with_commission ||
                      selectedRate.payment_options?.payment_types?.[0]?.show_amount}{' '}
                    {selectedRate.payment_options?.payment_types?.[0]?.show_currency_code}
                  </Text>
                </View>
                {[...(selectedRate.payment_options?.payment_types?.[0]?.tax_data?.taxes || [])].map((tax, index) => (
                  <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#A9A9A9' }}>{tax.name.replace('_', ' ')}</Text>
                    <Text style={{ color: '#FFFFFF' }}>
                      {tax.amount} {tax.currency_code}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>total price</Text>
                <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
                  {(
                    selectedRate.payment_options?.payment_types?.[0]?.show_amount_with_commission ||
                    selectedRate.payment_options?.payment_types?.[0]?.show_amount
                  ).toFixed(2)}{' '}
                  {selectedRate.payment_options?.payment_types?.[0]?.show_currency_code}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={{ 
              fontSize: 12, 
              textAlign: 'center', 
              color: '#A9A9A9', 
              marginTop: 16,
              lineHeight: 16
            }}>
              The price information for these dates is not available.{'\n'}
              Try selecting other dates.
            </Text>
          )}
        </>
      )}
    </View>
  )
}
