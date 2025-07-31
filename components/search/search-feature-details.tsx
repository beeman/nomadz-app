import ImportantInformationSection from '@/components/property/ImportantInformationSection'
import LocationSection from '@/components/property/LocationSection'
import { RootStackParamList, Routes } from '@/navigation/navigation.config'
import { api } from '@/utils/api'
import { RouteProp, useRoute } from '@react-navigation/native'
import { HttpStatusCode } from 'axios'
import { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'

type ApartmentDetailsParamsRouteProp = RouteProp<RootStackParamList, Routes.ApartmentDetails>

export function SearchFeatureDetails() {
  const route = useRoute<ApartmentDetailsParamsRouteProp>()
  const [selectedApartment, setSelectedApartment] = useState<any>(null)

  useEffect(() => {
    const request = async () => {
      const response = await api.get(`bookings/apartments/${route.params.id}`)

      if (response.status === HttpStatusCode.Ok) {
        setSelectedApartment(response.data)
      }
    }

    request().catch(console.error)
  }, [])

  // const [routerSearchParams] = useSearchParams()
  // const { selectedApartment, fetchApartment } = useApartments()
  // const { fetchApartmentRates, isApartmentRatesLoading } = useRates()

  // const parsedParams = parseQueryParams(routerSearchParams.toString())

  // const tomorrow = new Date()
  // tomorrow.setDate(tomorrow.getDate() + 1)

  // const dayAfterTomorrow = new Date()
  // dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)

  // const initialDates: DateRange = {
  //   dates: [
  //     parsedParams.checkin ? new Date(parsedParams.checkin as string) : tomorrow,
  //     parsedParams.checkout ? new Date(parsedParams.checkout as string) : dayAfterTomorrow,
  //   ],
  //   range: 'exact',
  // }

  // const initialGuests = {
  //   adults: Number(parsedParams?.guests?.adults) || 1,
  //   children: Array.isArray(parsedParams?.guests?.children) ? parsedParams.guests.children : [],
  // }

  // const debouncedFetchRates = debounce(
  //   (params: {
  //     hid: string | undefined
  //     params: {
  //       checkin: string
  //       checkout: string
  //       guests: { adults: number; children: number[] }
  //     }
  //   }) => {
  //     const searchParams = new URLSearchParams(window.location.search)

  //     // Update basic params
  //     searchParams.set('checkin', params.params.checkin)
  //     searchParams.set('checkout', params.params.checkout)
  //     searchParams.set('guests[adults]', params.params.guests.adults.toString())

  //     // Clear all existing children params
  //     const paramsToDelete: string[] = []
  //     searchParams.forEach((_, key) => {
  //       if (key.startsWith('guests[children]')) {
  //         paramsToDelete.push(key)
  //       }
  //     })
  //     paramsToDelete.forEach((param) => searchParams.delete(param))

  //     // Add new children params if any exist
  //     params.params.guests.children.forEach((age, index) => {
  //       searchParams.set(`guests[children][${index}]`, age.toString())
  //     })

  //     window.history.replaceState(null, '', `?${searchParams.toString()}`)

  //     // Make API call
  //     fetchApartmentRates(params)
  //   },
  //   500,
  // )

  // useEffect(() => {
  //   // Format dates for the initial fetch
  //   const [start, end] = initialDates.dates
  //   if (start && end) {
  //     fetchApartmentRates({
  //       hid: id,
  //       params: {
  //         checkin: formatDateToISOString(start),
  //         checkout: formatDateToISOString(end),
  //         guests: initialGuests,
  //       },
  //     })
  //   }
  // }, [id])

  // useEffect(() => {
  //   if (id) {
  //     fetchApartment(id)
  //   }
  // }, [id, fetchApartment])

  // const handlePropertyInfoChange = (values: {
  //   guests: { adults: number; children: number[] }
  //   checkin: string | null
  //   checkout: string | null
  // }) => {
  //   // Validate dates and guests
  //   if (!values.checkin || !values.checkout || values.guests.adults <= 0) {
  //     return
  //   }

  //   // Both URL update and API call will be debounced
  //   debouncedFetchRates({
  //     hid: id?.toString(),
  //     params: {
  //       checkin: values.checkin,
  //       checkout: values.checkout,
  //       guests: values.guests,
  //     },
  //   })
  // }

  // // Cleanup debounce on unmount
  // useEffect(() => {
  //   return () => {
  //     debouncedFetchRates.cancel()
  //   }
  // }, [])

  // if (!selectedApartment) {
  //   return (
  //     <View className="h-screen">
  //       <Loading />
  //     </View>
  //   )
  // }

  // return (
  //   <DefaultLayout>
  //     <View className="min-[340px]:px-6 pb-8 xl:pb-24 sm:px-12 xl:px-24">
  //       <View className="pt-8 xl:mb-20 lg:pt-24 xl:min-h-screen">
  //         <PropertyInfo
  //           property={selectedApartment}
  //           initialDates={initialDates}
  //           initialGuests={initialGuests}
  //           onChange={handlePropertyInfoChange}
  //           isLoading={isApartmentRatesLoading}
  //         />
  //       </View>
  //       <ReviewsSection property={selectedApartment} />
  //       <View className="grid gap-6 xl:grid-cols-2 xl:gap-16">
  //         <LocationSection property={selectedApartment} />
  //         <ImportantInformationSection property={selectedApartment} />
  //       </View>
  //     </View>
  //   </DefaultLayout>
  // )

  return (
    selectedApartment && (
      <ScrollView nestedScrollEnabled className="flex flex-col bg-[#000000] box-border px-[10px]">
        <View className="flex flex-col gap-6 box-border mb-[10px]">
          <LocationSection property={selectedApartment} />
          <ImportantInformationSection property={selectedApartment} />
        </View>
      </ScrollView>
    )
  )
}
