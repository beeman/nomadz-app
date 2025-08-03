import { useAuth } from '@/components/auth/auth-provider'
import { LoadingIcon } from '@/components/icons/Icons'
import FacilitiesCardMobile from '@/components/property/FacilitiesCardMobile'
import FacilitiesModal from '@/components/property/FacilitiesModal'
import ImageGallery from '@/components/property/ImageGallery'
import MobileImageGallery from '@/components/property/MobileImageGallery'
import RoomCard from '@/components/property/RoomCard'
import StatsBar from '@/components/property/StatsBar'
import EmptyState from '@/components/stays/EmptyState'
import Button from '@/components/ui/Button'
import { DateRange } from '@/components/ui/DatePicker'
import Modal from '@/components/ui/Modal'
import CryptoPayment from '@/components/ui/Payment/CryptoPayment'
import GuestsModal from '@/components/ui/Payment/GuestsModal'
import Spinner from '@/components/ui/Spinner'
import { useRates } from '@/hooks'
import { ApartmentInfo, GuestDetails } from '@/types/booking.types'
import { formatDateToISOString } from '@/utils/date.utils'
import toastNotifications from '@/utils/toastNotifications.utils'
import { useEffect, useState } from 'react'
import { Text, View } from 'react-native'

interface PropertyInfoProps {
  property: ApartmentInfo
  initialDates: DateRange
  initialGuests: {
    adults: number
    children: number[]
  }
  onChange?: (values: {
    guests: {
      adults: number
      children: number[]
    }
    checkin: string | null
    checkout: string | null
  }) => void
  isLoading?: boolean
}

interface PropertyInfoFiltersState {
  breakfast: 'all' | 'with' | 'without'
  freeCancellation: 'all' | 'with' | 'without'
}

export default function PropertyInfo({
  property,
  initialDates,
  initialGuests,
  onChange,
  isLoading = false,
}: PropertyInfoProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [isFacilitiesOpen, setIsFacilitiesOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isGuestsModalOpen, setIsGuestsModalOpen] = useState(false)
  const [guestsDetails, setGuestsDetails] = useState<GuestDetails[]>([])
  const [filters, setFilters] = useState<PropertyInfoFiltersState>({
    breakfast: 'all',
    freeCancellation: 'all',
  })
  const [dropdownOpen, setDropdownOpen] = useState<{ breakfast: boolean; freeCancellation: boolean }>({
    breakfast: false,
    freeCancellation: false,
  })
  const amenities = property.amenityGroups.find((group) => group.name === 'General')?.amenities

  const { selectedApartmentRates, isApartmentRatesLoading } = useRates()
  const [selectedRate, setSelectedRate] = useState<any>(null)
  const [availableRooms, setAvailableRooms] = useState<any>([])
  const [paymentInfo, setPaymentInfo] = useState({
    nights: 0,
    subtotal: 0,
    fee: 0,
    total: 0,
    currencyCode: '',
    bookHash: '',
  })
  const [visibleCount, setVisibleCount] = useState(3)

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, availableRooms.length))
  }

  const handleShowLess = () => {
    setVisibleCount(3)
  }

  useEffect(() => {
    if (selectedApartmentRates) {
      setAvailableRooms(() =>
        property.roomGroups
          .map((room) => {
            const rates: any[] = selectedApartmentRates?.rates?.filter((rate: any) => {
              // Breakfast filter
              const hasBreakfast = Boolean(rate?.meal_data?.has_breakfast)
              const breakfastMatch =
                filters.breakfast === 'all' ||
                (filters.breakfast === 'with' && hasBreakfast) ||
                (filters.breakfast === 'without' && !hasBreakfast)
              // Free cancellation filter
              const hasFreeCancellation = Boolean(
                rate?.payment_options?.payment_types?.some(
                  (type: any) => type.cancellation_penalties.free_cancellation_before,
                ),
              )
              const freeCancellationMatch =
                filters.freeCancellation === 'all' ||
                (filters.freeCancellation === 'with' && hasFreeCancellation) ||
                (filters.freeCancellation === 'without' && !hasFreeCancellation)
              return (
                breakfastMatch &&
                freeCancellationMatch &&
                rate?.room_data_trans?.main_name === room.nameStruct.mainName &&
                rate?.room_data_trans?.bedding_type === room.nameStruct.beddingType
              )
            })
            rates?.sort(
              (rateA, rateB) =>
                Number(rateA.payment_options.payment_types?.[0]?.amount || 0) -
                Number(rateB.payment_options.payment_types?.[0]?.amount || 0),
            )
            return { ...room, rates }
          })
          .filter((room) => room?.rates?.length > 0),
      )
    } else {
      setAvailableRooms([])
    }
  }, [filters, selectedApartmentRates])

  const handleBookNow = (_: any, rate: any = selectedApartmentRates?.rates?.[0], bookHash: string) => {
    if (!user) {
      toastNotifications.info('please, log in to book this property.')
      return
    }
    setSelectedRate(rate)
    // Calculate payment values based on the selected rate
    const paymentDetails = rate?.payment_options?.payment_types?.[0]
    const basePrice = paymentDetails?.show_amount ? Number(paymentDetails.show_amount) : 0

    // Use commission amount if available, otherwise calculate it
    const displayPrice = paymentDetails?.show_amount_with_commission
      ? Number(paymentDetails.show_amount_with_commission)
      : basePrice

    const taxes = paymentDetails?.tax_data?.taxes || []
    const totalTaxes = taxes.reduce((sum: number, tax: any) => {
      if (tax.currency_code === paymentDetails?.show_currency_code) {
        return sum + Number(tax.amount)
      }
      return sum
    }, 0)

    // For backend communication, use original amounts
    const totalPrice = basePrice + totalTaxes

    // For display, use commission amount (which already includes taxes if calculated properly)
    const displayTotalPrice = displayPrice

    setPaymentInfo({
      nights: rate?.daily_prices?.length || 0,
      subtotal: basePrice, // Keep original for backend
      fee: totalTaxes,
      total: totalPrice, // Keep original for backend
      currencyCode: paymentDetails?.show_currency_code || '',
      bookHash: rate?.book_hash || '',
    })
    setIsGuestsModalOpen(true)
  }

  const handleGuestsModalConfirm = (details: GuestDetails[]) => {
    setGuestsDetails(details)
    setIsGuestsModalOpen(false)
    setIsPaymentModalOpen(true)
  }

  const [dateRange, setDateRange] = useState<DateRange>(initialDates)
  const [guests, setGuests] = useState(initialGuests)

  const handleDateRangeChange = (newDateRange: DateRange) => {
    setDateRange(newDateRange)
    notifyChange(newDateRange, guests)
  }

  const handleGuestsChange = (newGuests: typeof guests) => {
    setGuests(newGuests)
    notifyChange(dateRange, newGuests)
  }

  const notifyChange = (dates: DateRange, currentGuests: typeof guests) => {
    if (onChange) {
      const [start, end] = dates.dates
      onChange({
        guests: currentGuests,
        checkin: start ? formatDateToISOString(start) : null,
        checkout: end ? formatDateToISOString(end) : null,
      })
    }
  }

  const { user } = useAuth()

  const totalReviews = property.reviews?.length || 0

  return (
    <View className="flex flex-col mb-6">
      <View>
        <View className="flex flex-col gap-6">
          <MobileImageGallery property={property} onGalleryOpen={() => setIsGalleryOpen(true)} />

          {/* Property Info */}
          <View className="flex text-white">
            <View className="flex flex-col">
              {/* Header */}
              <Text className="mb-4 text-xl font-primary-medium text-left text-white">{property.name}</Text>

              <StatsBar property={property} />
            </View>

            {/* Price Details */}
            {/* <FiltersSingleRoom
              dateRange={dateRange}
              guests={guests}
              onDateRangeChange={handleDateRangeChange}
              onGuestsChange={handleGuestsChange}
              isAuthenticated={!!user}
              isLoading={isLoading}
              selectedRate={selectedRate}
              onBookNow={() => handleBookNow(undefined, selectedRate, selectedRate?.book_hash || '')}
              isBookingEnabled={!isLoading && !!selectedRate}
              showBookingDetails={property.roomGroups.length === 1}
            /> */}
          </View>
        </View>

        {/* Room filters */}
        {/* <View className="flex items-stretch self-start gap-5 sm:bg-[#101010] text-white sm:p-4 rounded-2xl sm:border border-[#2A2A2A] shadow-md relative max-md:w-full w-fit max-[470px]:flex-col max-[470px]:justify-start"> */}
        {/* Meal options dropdown */}
        {/* <View className="relative min-w-[200px] max-md:grow">
            <Button
              className="w-full flex flex-col items-start justify-center bg-[#1F1F1F] rounded-xl px-4 py-3 text-left border border-[#272727] focus:outline-none focus:ring-2 focus:ring-[#272727] transition-colors"
              onClick={() => setDropdownOpen((o) => ({ ...o, breakfast: !o.breakfast }))}
              type="button"
            >
              <Text className="text-sm font-semibold">meal options</Text>
              <Text className="text-xs text-[#A9A9A9]">
                {filters.breakfast === 'all'
                  ? 'all options'
                  : filters.breakfast === 'with'
                    ? 'has breakfast'
                    : 'without breakfast'}
              </Text>
              <Text className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <path d="M6 8l4 4 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Text>
            </Button>
            <Dropdown
              isOpen={dropdownOpen.breakfast}
              onClose={() => setDropdownOpen((o) => ({ ...o, breakfast: false }))}
              className="w-full bg-[#232323] rounded-xl border border-[#323232] shadow-lg mt-2"
            >
              <ul className="py-2">
                <li>
                  <Button
                    className={`w-full text-left px-4 py-2 text-sm ${filters.breakfast === 'all' ? 'text-white font-semibold' : 'text-[#A9A9A9]'} hover:bg-[#292929] rounded-lg`}
                    onClick={() => {
                      setFilters((f) => ({ ...f, breakfast: 'all' }))
                      setDropdownOpen((o) => ({ ...o, breakfast: false }))
                    }}
                  >
                    all options
                  </Button>
                </li>
                <li>
                  <Button
                    className={`w-full text-left px-4 py-2 text-sm ${filters.breakfast === 'with' ? 'text-white font-semibold' : 'text-[#A9A9A9]'} hover:bg-[#292929] rounded-lg`}
                    onClick={() => {
                      setFilters((f) => ({ ...f, breakfast: 'with' }))
                      setDropdownOpen((o) => ({ ...o, breakfast: false }))
                    }}
                  >
                    has breakfast
                  </Button>
                </li>
                <li>
                  <Button
                    className={`w-full text-left px-4 py-2 text-sm ${filters.breakfast === 'without' ? 'text-white font-semibold' : 'text-[#A9A9A9]'} hover:bg-[#292929] rounded-lg`}
                    onClick={() => {
                      setFilters((f) => ({ ...f, breakfast: 'without' }))
                      setDropdownOpen((o) => ({ ...o, breakfast: false }))
                    }}
                  >
                    without breakfast
                  </Button>
                </li>
              </ul>
            </Dropdown>
          </View> */}
        {/* Cancelation policy dropdown */}
        {/* <View className="relative min-w-[200px] max-md:grow">
            <Button
              className="w-full flex flex-col items-start justify-center bg-[#1F1F1F] rounded-xl px-4 py-3 text-left border border-[#272727] focus:outline-none focus:ring-2 focus:ring-[#272727] transition-colors"
              onClick={() => setDropdownOpen((o) => ({ ...o, freeCancellation: !o.freeCancellation }))}
              type="button"
            >
              <Text className="text-sm font-semibold">cancelation policy</Text>
              <Text className="text-xs text-[#A9A9A9]">
                {filters.freeCancellation === 'all'
                  ? 'all options'
                  : filters.freeCancellation === 'with'
                    ? 'free cancelation'
                    : 'no free cancelation'}
              </Text>
              <Text className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <path d="M6 8l4 4 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Text>
            </Button>
            <Dropdown
              isOpen={dropdownOpen.freeCancellation}
              onClose={() => setDropdownOpen((o) => ({ ...o, freeCancellation: false }))}
              className="w-full bg-[#232323] rounded-xl border border-[#323232] shadow-lg mt-2"
            >
              <ul className="py-2">
                <li>
                  <Button
                    className={`w-full text-left px-4 py-2 text-sm ${filters.freeCancellation === 'all' ? 'text-white font-semibold' : 'text-[#A9A9A9]'} hover:bg-[#292929] rounded-lg`}
                    onClick={() => {
                      setFilters((f) => ({ ...f, freeCancellation: 'all' }))
                      setDropdownOpen((o) => ({ ...o, freeCancellation: false }))
                    }}
                  >
                    all options
                  </Button>
                </li>
                <li>
                  <Button
                    className={`w-full text-left px-4 py-2 text-sm ${filters.freeCancellation === 'with' ? 'text-white font-semibold' : 'text-[#A9A9A9]'} hover:bg-[#292929] rounded-lg`}
                    onClick={() => {
                      setFilters((f) => ({ ...f, freeCancellation: 'with' }))
                      setDropdownOpen((o) => ({ ...o, freeCancellation: false }))
                    }}
                  >
                    free cancelation
                  </Button>
                </li>
                <li>
                  <Button
                    className={`w-full text-left px-4 py-2 text-sm ${filters.freeCancellation === 'without' ? 'text-white font-semibold' : 'text-[#A9A9A9]'} hover:bg-[#292929] rounded-lg`}
                    onClick={() => {
                      setFilters((f) => ({ ...f, freeCancellation: 'without' }))
                      setDropdownOpen((o) => ({ ...o, freeCancellation: false }))
                    }}
                  >
                    no free cancelation
                  </Button>
                </li>
              </ul>
            </Dropdown>
          </View> */}
        {/* </View> */}

        {/* Room Cards */}
        <>
          {property.roomGroups.length > 1 && (availableRooms.length || isApartmentRatesLoading) && (
            <View className="mb-10">
              <Text className="mt-8 text-2xl text-white font-secondary">available rooms</Text>

              {isApartmentRatesLoading ? (
                <View className="flex flex-row min-h-[200px] justify-center items-center mt-6">
                  <Spinner duration={500}>
                    <LoadingIcon className="animate-spin" width={48} height={48} />
                  </Spinner>
                </View>
              ) : (
                <View className="mt-6 gap-y-12">
                  <View className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {availableRooms.slice(0, visibleCount).map((room: any, index: number) => {
                      return (
                        <RoomCard
                          key={index}
                          room={{
                            ...room,
                            price: (room as any).price ?? 0,
                            nameStruct: {
                              ...room.nameStruct,
                              beddingType: room.nameStruct?.beddingType ?? undefined,
                            },
                          }}
                          rate={room.rates[0]}
                          onBookNow={handleBookNow}
                          isAvailable={!!user}
                        />
                      )
                    })}
                  </View>

                  {availableRooms.length > 3 &&
                    (availableRooms.length > visibleCount ? (
                      <View className="flex flex-row justify-center mt-4">
                        <Button
                          className="px-6 py-2 bg-[#292929] transition-colors rounded-xl hover:bg-[#313131]"
                          onClick={handleShowMore}
                        >
                          <Text className="text-white">load more</Text>
                        </Button>
                      </View>
                    ) : (
                      <View className="flex flex-row justify-center mt-4">
                        <Button
                          className="px-6 py-2 bg-[#292929] transition-colors rounded-xl hover:bg-[#313131]"
                          onClick={handleShowLess}
                        >
                          <Text className="text-white">show less</Text>
                        </Button>
                      </View>
                    ))}
                </View>
              )}
            </View>
          )}

          {property.roomGroups.length > 1 &&
            (!selectedApartmentRates?.rates?.length || !availableRooms.length || isLoading) && (
              <EmptyState
                title="no rooms available"
                description="try selecting other dates."
                className={`my-6 ${isLoading ? 'opacity-0' : ''}`}
              />
            )}
        </>

        <View className="gap-y-4 text-white">
          {/* Description */}
          <Text className="text-[#A9A9A9] text-sm">{property.descriptionStruct?.[0]?.paragraphs[0]}</Text>

          {/* Facilities - single room */}
          {property.roomGroups.length === 1 && (
            <FacilitiesCardMobile amenities={amenities || []} onShowAll={() => setIsFacilitiesOpen(true)} />
          )}
        </View>
      </View>

      {/* Gallery Modal */}
      <Modal isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} className="px-6 w-full">
        <View className="w-full bg-[#151515] rounded-xl p-6 relative flex flex-col">
          <View className="flex flex-row justify-between items-center mb-6 gap-5">
            <View className="flex flex-row flex-1">
              <Text className="text-xl font-primary-medium text-left text-white">{property.name}</Text>
            </View>
            <View onTouchStart={() => setIsGalleryOpen(false)}>
              <Text className="text-white/60 text-lg font-primary-medium">close</Text>
            </View>
          </View>
          <ImageGallery
            images={property.images}
            roomGroups={property.roomGroups.map((room) => ({
              ...room,
              nameStruct: {
                ...room.nameStruct,
                mainName: room.nameStruct?.mainName || '',
              },
            }))}
          />
        </View>
      </Modal>

      {/* Facilities Modal */}
      <FacilitiesModal
        isOpen={isFacilitiesOpen}
        onClose={() => setIsFacilitiesOpen(false)}
        amenities={amenities || []}
      />

      {/* Add Guests Modal */}
      <Modal
        className="overflow-auto bg-transparent"
        isOpen={isGuestsModalOpen}
        onClose={() => setIsGuestsModalOpen(false)}
      >
        <GuestsModal
          guests={guests}
          onCancel={() => setIsGuestsModalOpen(false)}
          onConfirm={handleGuestsModalConfirm}
        />
      </Modal>

      {/* Add Payment Modal */}
      <Modal
        className="overflow-auto bg-transparent px-6 w-full"
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      >
        <CryptoPayment
          property={property}
          nights={paymentInfo.nights}
          subtotal={paymentInfo.subtotal}
          fee={paymentInfo.fee}
          total={paymentInfo.total}
          guests={{ ...guests, guestsDetails }}
          bookHash={paymentInfo.bookHash}
          currencyCode={'USDC'}
          dates={
            dateRange.dates[0] && dateRange.dates[1]
              ? `${dateRange.dates[0].toLocaleDateString('en-GB')} - ${dateRange.dates[1].toLocaleDateString('en-GB')}`
              : ''
          }
          beddingType={selectedRate?.room_data_trans?.main_name || ''}
          onSuccess={() => setIsPaymentModalOpen(false)}
          onCancel={() => setIsPaymentModalOpen(false)}
          selectedRate={selectedRate}
        />
      </Modal>
    </View>
  )
}
