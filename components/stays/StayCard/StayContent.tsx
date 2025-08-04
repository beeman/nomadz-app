import { useEffect, useRef, useState } from 'react'
import { ApartmentsItemInfo } from '../../../types/booking.types'
import { ApartmentInfo } from '../../../types/userToHotel.types'
import { formatPropertyRegion } from '../../../utils/location.utils'
import { formatPrice, getNightlyPriceWithCommission } from '../../../utils/rate.utils'

interface StayContentProps {
  stay: ApartmentsItemInfo | ApartmentInfo
}

export function StayContent({ stay }: StayContentProps) {
  const [contentPadding, setContentPadding] = useState('py-3')
  const titleRef = useRef<HTMLDivElement>(null)

  // Get the lowest price with commission if available
  const getLowestPrice = () => {
    // Check if this is an ApartmentsItemInfo by checking for rates property
    if (!('rates' in stay) || !stay.rates?.[0]) {
      return 0
    }
    return getNightlyPriceWithCommission(stay.rates[0])
  }

  const lowestPrice = getLowestPrice()

  useEffect(() => {
    if (titleRef.current) {
      const lineHeight = 18 // from text-[14px]/[18px]
      const height = titleRef.current.offsetHeight
      const isMultiline = height > lineHeight

      setContentPadding(isMultiline ? 'py-3' : 'py-4')
    }
  }, [stay.name])

  return (
    <View className={`@container flex flex-col justify-between h-full px-4 ${contentPadding} @[330px]:py-6`}>
      <View className="flex justify-between items-start gap-x-2">
        <View
          ref={titleRef}
          className="font-medium text-white text-xs @[232px]:text-[14px]/[18px] break-words flex-1 line-clamp-1 @[230px]:line-clamp-2 @[330px]:text-lg @[330px]:h-14 @[420px]:text-xl truncate text-wrap"
        >
          {stay.name}
        </View>
        {!!stay.rating && (
          <View className="flex items-center gap-1 text-xs text-white @[330px]:text-sm @[420px]:text-base shrink-0">
            <Text className="text-[#FFBF75] text-[10px] @[330px]:text-xs @[420px]:text-sm">★</Text>
            <Text className="text-[10px] @[330px]:text-sm @[420px]:text-base">{stay.rating}</Text>
            <Text className="text-[#A9A9A9] text-[10px] @[330px]:text-sm @[420px]:text-base">
              ({'reviewsNumber' in stay ? stay.reviewsNumber : 0})
            </Text>
          </View>
        )}
      </View>
      <View className="flex gap-2 justify-between items-center">
        <View className="w-full text-[#A9A9A9] text-[10px] @[232px]:text-xs @[330px]:text-base line-clamp-1 @[280px]:line-clamp-2">
          {formatPropertyRegion([stay.region?.name, stay.region?.countryName])}
        </View>
        {!!lowestPrice && (
          <View className="flex gap-1 justify-end items-center w-full text-white">
            <View className="font-semibold text-xs @[232px]:text-sm @[330px]:text-base @[420px]:text-lg">
              ${formatPrice(lowestPrice)}
            </View>
            <View className="text-[#A9A9A9] text-[10px] @[232px]:text-xs @[330px]:text-base text-right text-nowrap">
              {' '}
              / night
            </View>
          </View>
        )}
      </View>
    </View>
  )
}
