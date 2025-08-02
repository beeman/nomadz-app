import { AMENITY_METADATA, DEFAULT_AMENITY_METADATA } from '@/data/amenityMetadata'
import { Text, View } from 'react-native'

interface FacilitiesCardMobileProps {
  amenities: string[]
  onShowAll: () => void
  className?: string
}

export default function FacilitiesCardMobile({ amenities, onShowAll, className = '' }: FacilitiesCardMobileProps) {
  return (
    <View className="border-gradient-gray rounded-xl">
      <View className={`w-fit p-6 bg-[#161616] rounded-xl ${className}`}>
        <View>
          <Text className="mb-4 text-lg font-primary-semibold text-left text-white">Facilities</Text>
          <View className="flex flex-col gap-3">
            {amenities?.slice(0, 4).map((amenity, index) => {
              const metadata = AMENITY_METADATA[amenity] || DEFAULT_AMENITY_METADATA
              const IconComponent = (metadata?.icon as any) || (DEFAULT_AMENITY_METADATA.icon as any)

              return (
                <View key={index} className="flex items-center gap-3">
                  <IconComponent width={20} height={20} color="white" />
                  <Text className="text-xs 2xl:text-sm">{amenity}</Text>
                </View>
              )
            })}
          </View>
        </View>
        {amenities?.length && amenities?.length > 4 && (
          <View onTouchStart={onShowAll} className="mt-6">
            <Text className="text-xs text-[#A9A9A9] underline">all facilities</Text>
          </View>
        )}
      </View>
    </View>
  )
}
