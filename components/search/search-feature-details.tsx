import Loading from '@/components/Loading'
import ImportantInformationSection from '@/components/property/ImportantInformationSection'
import LocationSection from '@/components/property/LocationSection'
import PropertyInfo from '@/components/property/PropertyInfo'
import ReviewsSection from '@/components/property/ReviewsSection'
import { DateRange } from '@/components/ui/DatePicker'
import { useApartments, useRates } from '@/hooks'
import { RootStackParamList, Routes } from '@/navigation/navigation.config'
import { formatDateToISOString } from '@/utils/date.utils'
import { RouteProp, useRoute } from '@react-navigation/native'
import debounce from 'lodash/debounce'
import { useEffect } from 'react'
import { ScrollView, View } from 'react-native'

type ApartmentDetailsParamsRouteProp = RouteProp<RootStackParamList, Routes.ApartmentDetails>

export function SearchFeatureDetails() {
  const route = useRoute<ApartmentDetailsParamsRouteProp>()
  const { selectedApartment, fetchApartment } = useApartments()
  const { fetchApartmentRates, isApartmentRatesLoading } = useRates()

  useEffect(() => {
    const request = async () => {
      fetchApartment(route.params.id)
    }

    request().catch(console.error)
  }, [route.params.id, fetchApartment])

  const parsedParams = route.params

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  const dayAfterTomorrow = new Date()
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)

  const initialDates: DateRange = {
    dates: [
      parsedParams.checkin ? new Date(parsedParams.checkin as string) : tomorrow,
      parsedParams.checkout ? new Date(parsedParams.checkout as string) : dayAfterTomorrow,
    ],
    range: 'exact',
  }

  const initialGuests = {
    adults: Number(parsedParams?.guests?.adults) || 1,
    children: Array.isArray(parsedParams?.guests?.children) ? parsedParams.guests.children : [],
  }

  const debouncedFetchRates = debounce(
    (params: {
      hid: string | undefined
      params: {
        checkin: string
        checkout: string
        guests: { adults: number; children: number[] }
      }
    }) => {
      const searchParams = new URLSearchParams(window.location.search)

      // Update basic params
      searchParams.set('checkin', params.params.checkin)
      searchParams.set('checkout', params.params.checkout)
      searchParams.set('guests[adults]', params.params.guests.adults.toString())

      // Clear all existing children params
      const paramsToDelete: string[] = []
      searchParams.forEach((_, key) => {
        if (key.startsWith('guests[children]')) {
          paramsToDelete.push(key)
        }
      })
      paramsToDelete.forEach((param) => searchParams.delete(param))

      // Add new children params if any exist
      params.params.guests.children.forEach((age, index) => {
        searchParams.set(`guests[children][${index}]`, age.toString())
      })

      window.history.replaceState(null, '', `?${searchParams.toString()}`)

      // Make API call
      fetchApartmentRates(params as any)
    },
    500,
  )

  useEffect(() => {
    // Format dates for the initial fetch
    const [start, end] = initialDates.dates
    if (start && end) {
      fetchApartmentRates({
        hid: route.params.id,
        params: {
          checkin: formatDateToISOString(start),
          checkout: formatDateToISOString(end),
          guests: initialGuests,
        },
      })
    }
  }, [route.params.id])

  const handlePropertyInfoChange = (values: {
    guests: { adults: number; children: number[] }
    checkin: string | null
    checkout: string | null
  }) => {
    // Validate dates and guests
    if (!values.checkin || !values.checkout || values.guests.adults <= 0) {
      return
    }

    // Both URL update and API call will be debounced
    debouncedFetchRates({
      hid: route.params.id.toString(),
      params: {
        checkin: values.checkin,
        checkout: values.checkout,
        guests: values.guests,
      },
    })
  }

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedFetchRates.cancel()
    }
  }, [])

  if (!selectedApartment) {
    return (
      <View className="h-screen">
        <Loading />
      </View>
    )
  }

  return (
    selectedApartment && (
      <ScrollView nestedScrollEnabled className="flex flex-col bg-[#000000] box-border px-6">
        <View className="flex flex-col gap-6 box-border my-8">
          <PropertyInfo
            property={selectedApartment}
            initialDates={initialDates}
            initialGuests={initialGuests}
            onChange={handlePropertyInfoChange}
            isLoading={isApartmentRatesLoading}
          />
          <ReviewsSection property={selectedApartment} />
          <View className="flex flex-col gap-6 box-border">
            <LocationSection property={selectedApartment} />
            <ImportantInformationSection property={selectedApartment} />
          </View>
        </View>
      </ScrollView>
    )
  )
}
