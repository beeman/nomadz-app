import { LoadingIcon } from '@/components/icons/Icons'
import ImportantInformationSection from '@/components/property/ImportantInformationSection'
import LocationSection from '@/components/property/LocationSection'
import PropertyInfo from '@/components/property/PropertyInfo'
import ReviewsSection from '@/components/property/ReviewsSection'
import { DateRange } from '@/components/search/date-picker'
import Spinner from '@/components/ui/Spinner'
import { useApartments, useRates } from '@/hooks'
import { RootStackParamList, Routes } from '@/navigation/navigation.config'
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

  const formatDateToISO = (dateString: string) => {
    if (!dateString) return null

    // If already in yyyy-mm-dd format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString
    }

    // If in mm-dd-yyyy format, convert to yyyy-mm-dd
    const [month, day, year] = dateString.split('-')
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  const initialDates: DateRange = {
    checkin: parsedParams.checkin
      ? formatDateToISO(parsedParams.checkin as string)
      : tomorrow.toISOString().slice(0, 10),
    checkout: parsedParams.checkout
      ? formatDateToISO(parsedParams.checkout as string)
      : dayAfterTomorrow.toISOString().slice(0, 10),
    range: 'exact',
  }

  // Parse guests from URL parameters
  const parseGuestsFromParams = (params: any) => {
    // Handle flat URL parameters with bracket notation
    const adults = Number(params['guests[adults]']) || 1

    // Parse children from flat parameters
    let children: number[] = []
    const childrenKeys = Object.keys(params).filter((key) => key.startsWith('guests[children]['))

    if (childrenKeys.length > 0) {
      children = childrenKeys
        .map((key) => {
          const value = params[key]
          return Number(value) || 12
        })
        .filter((age) => age > 0)
        .sort((a, b) => a - b) // Sort by age
    }

    return { adults, children }
  }

  const initialGuests = parseGuestsFromParams(parsedParams)

  const debouncedFetchRates = debounce(
    (params: {
      hid: string | undefined
      params: {
        checkin: string
        checkout: string
        guests: { adults: number; children: number[] }
      }
    }) => {
      // Make API call
      fetchApartmentRates(params as any)
    },
    500,
  )

  useEffect(() => {
    // Format dates for the initial fetch
    if (initialDates.checkin && initialDates.checkout) {
      fetchApartmentRates({
        hid: route.params.id,
        params: {
          checkin: initialDates.checkin,
          checkout: initialDates.checkout,
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
      <View className="h-screen flex flex-row justify-center items-center bg-[#000000]">
        <Spinner duration={500}>
          <LoadingIcon width={64} height={64} color="white" />
        </Spinner>
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
