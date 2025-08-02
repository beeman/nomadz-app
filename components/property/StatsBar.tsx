import { HouseFilledIcon, MapPinFilledIcon, PersonInBedIcon } from '@/components/icons/Icons'
import { ApartmentInfo } from '@/types/booking.types'
import { formatPropertyRegion } from '@/utils/location.utils'
import { Text, View } from 'react-native'

interface StatsBarProps {
  property: ApartmentInfo
}

export default function StatsBar({ property }: StatsBarProps) {
  return (
    <View className="bg-[#151515] border border-[#292929] rounded-xl px-8 py-4 mb-6">
      <View className="flex flex-row items-center w-full gap-2 ">
        <View className="flex flex-col gap-y-1 grow">
          <View className="flex flex-row items-center gap-1.5">
            <Text className="text-[#FFBF75] text-2xl">★</Text>
            {property.rating ? (
              <Text className="text-white text-lg font-primary-medium mt-2">{property.rating}</Text>
            ) : (
              <Text className="text-[#A9A9A9] text-lg font-primary-medium mt-2">No rating yet</Text>
            )}
          </View>
          <View className={`flex flex-row items-center gap-1.5`}>
            <MapPinFilledIcon width={16} height={16} color="white" />
            <Text
              className={`${!property.region?.name && !property.region?.countryCode ? 'text-[#A9A9A9]' : 'text-white'} text-lg font-primary-medium`}
            >
              {formatPropertyRegion([property.region?.name, property.region?.countryCode])}
            </Text>
          </View>
        </View>

        <View className="gap-y-1 flex flex-col grow">
          {property.facts.roomsNumber && (
            <View className="flex flex-row items-center gap-1.5">
              <PersonInBedIcon width={16} height={16} color="white" />
              <Text className="text-white text-lg font-primary-medium">{property.facts.roomsNumber} rooms</Text>
            </View>
          )}
          {property.facts.floorsNumber && (
            <View className="flex flex-row items-center gap-1.5">
              <HouseFilledIcon width={16} height={16} color="white" />
              <Text className="text-white text-lg font-primary-medium">{property.facts.floorsNumber} floors</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}
