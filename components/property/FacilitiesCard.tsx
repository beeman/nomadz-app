import { AMENITY_METADATA, DEFAULT_AMENITY_METADATA } from '../../data/amenityMetadata'

// Heroicons ArrowUpRight
const ArrowUpRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 16.5L16.5 7.5M16.5 7.5H7.5m9 0v9" />
  </svg>
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
      <View className="flex bg-[#121212] border border-[#242424] rounded-[14px] p-4">
        <View
          className={`relative flex flex-wrap gap-x-4 gap-y-2 text-white items-center @[270px]:flex-row max-h-12 overflow-hidden ${className}`}
        >
          {amenities.map((amenity, index) => {
            const metadata = AMENITY_METADATA[amenity] || DEFAULT_AMENITY_METADATA
            const IconComponent = metadata.icon
            return (
              <View key={index} className="flex items-center gap-1 text-xs text-white">
                <Text
                  className="flex-shrink-0 size-4 @[350px]:size-5"
                  style={{ display: 'inline-flex', alignItems: 'center' }}
                >
                  <IconComponent />
                </Text>
                <Text className="text-xs">{amenity}</Text>
              </View>
            )
          })}
        </View>
        {hasMore && (
          <Button
            onClick={onShowAll}
            className="-mt-0.5 text-xs text-[#D0D0D0] h-fit whitespace-nowrap flex items-center rounded hover:bg-[#232323] transition-colors bg-[#121212]"
            title="Show all facilities"
          >
            <ArrowUpRightIcon />
          </Button>
        )}
      </View>
    </View>
  )
}
