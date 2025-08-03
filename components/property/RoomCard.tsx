import { DoubleBedIcon, SingleBedIcon } from '@/components/icons/Icons'
import CancellationRulesModal from '@/components/property/CancellationRulesModal'
import FacilitiesCard from '@/components/property/FacilitiesCard'
import Button from '@/components/ui/Button'
import WhiteButton from '@/components/ui/Buttons/WhiteButton'
import Modal from '@/components/ui/Modal'
import { CURRENCIES } from '@/constants'
import { AMENITY_METADATA, DEFAULT_AMENITY_METADATA } from '@/data/amenityMetadata'
import { CalendarX } from 'lucide-react-native'
import { useState } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'

interface RoomCardProps {
  room: {
    name: string
    price: number
    images: string[]
    amenities: string[]
    nameStruct?: {
      beddingType?: string
    }
    guests?: number
  }
  rate: {
    book_hash: string
    daily_prices: string[]
    meal_data: {
      value: string
      has_breakfast: boolean
      no_child_meal: boolean
    }
    payment_options?: {
      payment_types: {
        show_currency_code: string
        show_amount?: string
        show_amount_with_commission?: string
        tax_data?: {
          taxes: {
            currency_code: string
            amount: string
          }[]
        }
        cancellation_penalties?: any
      }[]
    }
  } | null
  onBookNow: (room: any, rate: any, hash: string) => void
  isAvailable: boolean
}

export default function RoomCard({ room, rate, onBookNow, isAvailable }: RoomCardProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [isFacilitiesOpen, setIsFacilitiesOpen] = useState(false)
  const [isCancellationOpen, setIsCancellationOpen] = useState(false)

  // Calculate total amount including taxes
  const paymentDetails = rate?.payment_options?.payment_types?.[0]

  let totalAmount: number

  // If we have commission amount that includes taxes, use it directly
  if (paymentDetails?.show_amount_with_commission) {
    totalAmount = Number(paymentDetails.show_amount_with_commission)
  } else {
    // Fallback to original calculation
    const basePrice = paymentDetails?.show_amount ? Number(paymentDetails.show_amount) : 0
    const taxes = paymentDetails?.tax_data?.taxes || []
    const totalTaxes = taxes.reduce((sum, tax) => {
      if (tax.currency_code === paymentDetails?.show_currency_code) {
        return sum + Number(tax.amount)
      }
      return sum
    }, 0)
    totalAmount = basePrice + totalTaxes
  }

  const nights = rate?.daily_prices?.length || 1
  const currencyChar = CURRENCIES.find((c) => c.code === paymentDetails?.show_currency_code)?.char
  const mealData = rate?.meal_data || {
    value: 'nomeal',
    has_breakfast: false,
    no_child_meal: true,
  }

  // Get cancellation data from rate
  const cancellationPenalties = paymentDetails?.cancellation_penalties || null
  const freeCancellationBefore = cancellationPenalties?.free_cancellation_before || null

  return (
    <View className="border border-stone-700 rounded-[24px] flex flex-col font-geist">
      <View className="!p-1 rounded-[23px] bg-[linear-gradient(to_bottom_right,_#121212,_#131313)] flex flex-col">
        <View className="@container relative rounded-[19px] bg-black !py-7 !px-6 @sm:!p-4 flex flex-col">
          {/* Main content: image + price side by side */}
          <View className="flex flex-row gap-6 min-h-[90.45px]">
            <View className="flex flex-row flex-1">
              {/* Image */}
              {!!room.images[0] && (
                <View
                  className="w-full cursor-pointer shrink-0 !aspect-[3/2]"
                  onTouchEnd={() => setIsGalleryOpen(true)}
                >
                  <Image
                    src={room.images?.[0].replace('{size}', '640x640') || ''}
                    alt="Room main view"
                    className="object-cover w-full h-full rounded-xl !aspect-[3/2]"
                  />
                </View>
              )}
            </View>
            <View className="flex flex-1 flex-row">
              {/* Price and nights */}
              <View className="flex flex-col justify-center">
                <View>
                  <Text className="text-[15px] text-[#CCCCCC]">
                    {nights} night{nights > 1 ? 's' : ''}
                  </Text>
                </View>
                <View>
                  <Text className="text-4xl font-semibold text-white">
                    {currencyChar}
                    {totalAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                </View>
                <View>
                  <Text className="mt-1 text-sm text-[#CCCCCC]">including taxes and fees</Text>
                </View>
              </View>
            </View>
          </View>

          <View className="h-px mt-5 bg-[#323232]" />

          {/* Room name, bed */}
          <View className="px-0 pt-0 mb-2">
            <View>
              <Text className="my-6 mb-1 text-2xl font-semibold text-white">{room.name}</Text>
            </View>
            {!!room?.nameStruct?.beddingType && (
              <View className="flex flex-row items-center gap-2 my-6 text-base">
                {room?.nameStruct?.beddingType?.includes('single') && (
                  <View className="flex flex-row items-center gap-1.5">
                    <Text className="text-white text-sm">{room.nameStruct.beddingType}</Text>

                    <SingleBedIcon height={14} color="white" />
                  </View>
                )}
                {room?.nameStruct?.beddingType?.includes('twin') && (
                  <View className="flex flex-row items-center gap-1.5 text-sm">
                    <Text className="text-white text-sm">{room.nameStruct.beddingType}</Text>
                    <SingleBedIcon height={14} color="white" /> <SingleBedIcon height={14} />
                  </View>
                )}
                {room?.nameStruct?.beddingType?.includes('double') && (
                  <View className="flex flex-row items-center gap-1.5 text-sm">
                    <Text className="text-white text-sm">{room.nameStruct.beddingType}</Text>
                    <DoubleBedIcon height={14} color="white" />
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Breakfast Included */}
          {!!mealData.has_breakfast && (
            <View className="bg-[#121212] px-6 py-3 rounded-[14px] mx-0 mb-4 flex flex-col gap-1 border border-[#242424]">
              <Text className="flex flex-row items-center gap-2 text-sm font-medium text-white">
                🍳 Breakfast Included
              </Text>
              <Text className="text-xs text-[#D0D0D0]">Breakfast options available during your stay.</Text>
            </View>
          )}

          {rate?.payment_options?.payment_types?.some(
            (type) => type.cancellation_penalties.free_cancellation_before,
          ) && (
            <View className="bg-[#121212] px-6 py-3 rounded-[14px] mx-0 mb-4 flex flex-col gap-1 border border-[#242424]">
              <View className="flex flex-row items-center gap-2 ">
                <Text className="text-sm font-primary-medium text-white">
                  <CalendarX width={16} height={16} color="white" /> Free Cancellation Available
                </Text>
              </View>
              <Text className="text-xs text-[#D0D0D0]">
                {`You will be able cancel your order before ${new Intl.DateTimeFormat('en-US', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                }).format(
                  new Date(
                    rate?.payment_options?.payment_types?.find(
                      (type) => type.cancellation_penalties.free_cancellation_before,
                    )!.cancellation_penalties.free_cancellation_before,
                  ),
                )} for no cost`}
              </Text>
            </View>
          )}

          {/* Amenities */}
          <FacilitiesCard amenities={room.amenities} onShowAll={() => setIsFacilitiesOpen(true)} />

          {/* Spacer to push bottom section down */}
          <View className="flex-1 min-h-6" />

          {/* Cancellation Rules and Book Now - always at the bottom */}
          <View className="flex flex-row items-center px-0 mt-2">
            <View className="flex flex-row flex-1 items-center">
              <Button
                onClick={() => setIsCancellationOpen(true)}
                disabled={!isAvailable}
                className="!bg-ransparent flex items-center justify-center"
              >
                <Text className="text-sm underline text-[#D0D0D0] content-center text-left">Cancellation Rules</Text>
              </Button>
            </View>
            <View className="flex flex-row flex-1 items-center">
              <WhiteButton
                className={`w-full flex items-center justify-center py-2 px-3 !mt-0 text-black bg-gradient-to-b from-white via-white to-[#E0E0E0] rounded-full 
                  focus:outline-none ring-2 ring-white/10 focus:ring-opacity-50 shadow-inner-bottom bg-white ${!isAvailable ? `opacity-75` : ``}`}
                onClick={() => onBookNow(room, rate, rate?.book_hash || '')}
                disabled={!isAvailable}
              >
                <Text className="text-black font-semibold">book now</Text>
              </WhiteButton>
            </View>
          </View>

          {/* Gallery Modal */}
          {isGalleryOpen && (
            <Modal isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} className="z-50 px-6">
              <View className="w-full bg-[#151515] rounded-xl p-6 overflow-y-auto">
                <View className="flex flex-row w-full items-center justify-between mb-6">
                  <Text className="text-xl font-primary-medium text-white">Gallery</Text>
                  <View onTouchStart={() => setIsGalleryOpen(false)}>
                    <Text className="text-white/60 hover:text-white">close</Text>
                  </View>
                </View>
                <ScrollView className="max-h-[600px] flex flex-col gap-y-5">
                  {room.images.map((image, index) => (
                    <View
                      key={index}
                      className="w-full rounded-lg overflow-hidden relative"
                      style={{ marginBottom: index === room.images.length - 1 ? 0 : 16 }}
                    >
                      <Image src={image.replace('{size}', '640x640')} className="object-cover w-full aspect-[3/2]" />
                    </View>
                  ))}
                </ScrollView>
              </View>
            </Modal>
          )}

          {/* Facilities Modal */}
          {isFacilitiesOpen && (
            <Modal isOpen={isFacilitiesOpen} onClose={() => setIsFacilitiesOpen(false)} className="px-6">
              <ScrollView className="max-w-[800px] max-h-[600px] bg-[#121212] rounded-2xl overflow-y-auto no-scrollbar border border-[#313131]">
                <View className="p-8">
                  <View className="flex flex-col gap-4">
                    {room.amenities.map((amenity, index) => {
                      const metadata = AMENITY_METADATA[amenity] || DEFAULT_AMENITY_METADATA
                      const IconComponent = metadata.icon as any
                      return (
                        <View key={index} className="p-6 rounded-lg bg-[#1A1A1A] border border-[#292929] text-white">
                          <View className="flex flex-row items-center gap-3 mb-2">
                            <Text className="inline-flex flex-row items-center justify-center">
                              <IconComponent width={16} height={16} color="white" />
                            </Text>
                            <Text className="font-primary-medium text-left text-white">{amenity}</Text>
                          </View>
                          <Text className="text-xs text-white">{metadata.description}</Text>
                        </View>
                      )
                    })}
                  </View>
                </View>
              </ScrollView>
            </Modal>
          )}

          {/* Cancellation Rules Modal */}
          <CancellationRulesModal
            isOpen={isCancellationOpen}
            onClose={() => setIsCancellationOpen(false)}
            freeCancellationBefore={freeCancellationBefore}
            cancellationPenalties={cancellationPenalties}
            currencyChar={currencyChar}
          />
        </View>
      </View>
    </View>
  )
}
