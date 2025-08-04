import { IconProps } from '@/components/icons/Icons'
import { AMENITY_METADATA, DEFAULT_AMENITY_METADATA } from '@/data/amenityMetadata'
import { FC } from 'react'
import { Text, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'

// Heroicons ArrowUpRight
const ArrowUpRightIcon: FC<IconProps> = ({ ...props }) => (
  <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={props.color} className="w-5 h-5" {...props}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M7.5 16.5L16.5 7.5M16.5 7.5H7.5m9 0v9" />
  </Svg>
)

interface FacilitiesCardProps {
  amenities: string[]
  onShowAll: () => void
  className?: string
}

export default function FacilitiesCard({ amenities, onShowAll, className = '' }: FacilitiesCardProps) {
  const maxAmenities = 5
  const hasMore = amenities.length > maxAmenities

  return (
    <View className="container">
      <View className="flex flex-row bg-[#121212] border border-[#242424] rounded-[14px] p-4">
        <View
          className={`relative flex flex-row flex-1 flex-wrap gap-x-4 gap-y-2 items-center max-h-12 overflow-hidden ${className}`}
        >
          {amenities.map((amenity, index) => {
            const metadata = AMENITY_METADATA[amenity] || DEFAULT_AMENITY_METADATA
            const IconComponent = metadata.icon as any

            return (
              <View key={index} className="flex flex-row items-center gap-1.5 text-white">
                <Text className="flex-shrink-0 size-4 inline-flex text-sm flex-row items-center text-white">
                  <IconComponent width={14} height={14} color="white" />
                </Text>
                <Text className="text-sm text-white">{amenity}</Text>
              </View>
            )
          })}
        </View>
        {hasMore && (
          <View
            className="flex -mt-0.5 flex-row items-center justify-center w-5 h-5 rounded hover:bg-[#232323] transition-colors !bg-[#121212]"
            onTouchStart={onShowAll}
          >
            <ArrowUpRightIcon width={20} height={20} color="#D0D0D0" />
          </View>
        )}
      </View>
    </View>
  )
}
