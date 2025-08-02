import { LoadingIcon } from '@/components/icons/Icons'
import DatePicker, { DateRange } from '@/components/ui/DatePicker'
import GuestNumberInput from '@/components/ui/SearchBar/GuestsInput'
import { Link } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

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
  return (
    <View className={`flex-1 rounded-xl ${showBookingDetails ? 'p-6 bg-[#161616]' : ''}`}>
      <View className="grid md:flex grid-cols-3 min-[400px]:gap-x-4 px-7 py-7 max-md:px-4 max-[400px]:py-4 items-center mb-6 rounded-2xl bg-[#1F1F1F] relative border border-[#323232]">
        <DatePicker
          value={dateRange}
          minDate={new Date()}
          onChange={onDateRangeChange}
          className="w-full col-span-full min-[400px]:col-span-2"
          buttonClassName="w-full rounded-xl flex justify-center"
          dropdownClassName="sm:-right-[152px] md:right-0 md:-left-[216px] sm:w-[522px] w-[284px]"
          zIndex={20}
        />
        <View className="flex max-[400px]:col-span-full max-[400px]:mt-2">
          <View className="max-[400px]:hidden !w-[1px] !h-[38px] bg-[#4A4A4A] !mr-8"></View>
          <GuestNumberInput
            className="w-full !static min-[400px]:[&>button]:justify-center max-[400px]:w-fit max-[400px]:mx-auto"
            guests={guests}
            onGuestsChange={onGuestsChange}
          />
        </View>
      </View>

      {showBookingDetails && (
        <>
          {!isAuthenticated ? (
            <View className="py-4 text-center">
              <Text className="text-[#A9A9A9] mb-2">please, log in to book this property</Text>
              <Link
                href={`/sign-in?redirect_to=${encodeURIComponent(window.location.href)}`}
                className="text-white underline hover:text-white/80"
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
              className={`w-full transition-colors rounded-[14px] text-lg font-medium ${isLoading || !selectedRate ? 'border-2 border-white/40 cursor-default py-1.5' : '!py-2 border-gradient-primary before:rounded-[14px]'}`}
            >
              <Text className={`${isBookingEnabled ? `text-white` : `text-white/40`}`}>book now</Text>
            </View>
          )}

          {isLoading ? (
            <View className="flex justify-center items-center py-4">
              <LoadingIcon className="animate-spin" width={32} height={32} />
            </View>
          ) : selectedRate ? (
            <View className="mt-6 gap-y-2">
              <View className="overflow-y-auto gap-y-2 max-h-32 no-scrollbar">
                <View className="flex justify-between">
                  <Text className="text-[#A9A9A9]">base price</Text>
                  <Text>
                    {selectedRate.payment_options?.payment_types?.[0]?.show_amount_with_commission ||
                      selectedRate.payment_options?.payment_types?.[0]?.show_amount}{' '}
                    {selectedRate.payment_options?.payment_types?.[0]?.show_currency_code}
                  </Text>
                </View>
                {[...(selectedRate.payment_options?.payment_types?.[0]?.tax_data?.taxes || [])].map((tax, index) => (
                  <View key={index} className="flex justify-between">
                    <Text className="text-[#A9A9A9]">{tax.name.replace('_', ' ')}</Text>
                    <Text>
                      {tax.amount} {tax.currency_code}
                    </Text>
                  </View>
                ))}
              </View>
              <View className="flex justify-between font-semibold">
                <Text>total price</Text>
                <Text>
                  {(
                    selectedRate.payment_options?.payment_types?.[0]?.show_amount_with_commission ||
                    selectedRate.payment_options?.payment_types?.[0]?.show_amount
                  ).toFixed(2)}{' '}
                  {selectedRate.payment_options?.payment_types?.[0]?.show_currency_code}
                </Text>
              </View>
            </View>
          ) : (
            <Text className="text-xs text-center text-[#A9A9A9] mt-4">
              The price information for these dates is not available.
              {'\n'}
              Try selecting other dates.
            </Text>
          )}
        </>
      )}
    </View>
  )
}
