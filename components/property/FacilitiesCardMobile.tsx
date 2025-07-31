import { AMENITY_METADATA, DEFAULT_AMENITY_METADATA } from '../../data/amenityMetadata';

interface FacilitiesCardMobileProps {
  amenities: string[];
  onShowAll: () => void;
  className?: string;
}

export default function FacilitiesCardMobile({ amenities, onShowAll, className = '' }: FacilitiesCardMobileProps) {
  return (
    <View className='border-gradient-gray rounded-xl'>
      <View className={`w-fit p-6 bg-[#161616] rounded-xl ${className}`}>
        <View>
          <Text className='mb-4 text-lg font-semibold text-left 2xl:text-xl'>Facilities</Text>
          <View className='space-y-3'>
            {amenities?.slice(0, 4).map((amenity, index) => {
              const metadata = AMENITY_METADATA[amenity] || DEFAULT_AMENITY_METADATA;
              const IconComponent = metadata?.icon || DEFAULT_AMENITY_METADATA.icon;

              return (
                <View key={index} className='flex items-center gap-3'>
                  <IconComponent className='w-5 h-5 text-white' />
                  <Text className='text-xs 2xl:text-sm'>{amenity}</Text>
                </View>
              );
            })}
          </View>
        </View>
        {amenities?.length && amenities?.length > 4 && (
          <button
            onClick={onShowAll}
            className='mt-6 text-xs 2xl:text-sm text-[#A9A9A9] underline'
          >
            all facilities
          </button>
        )}
      </View>
    </View>
  );
} 