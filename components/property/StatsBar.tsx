import { ApartmentInfo } from '../../types/booking.types';
import { formatPropertyRegion } from '../../utils/location.utils';
import { HouseFilledIcon, MapPinFilledIcon, PersonInBedIcon } from '../icons/Icons';

interface StatsBarProps {
  property: ApartmentInfo;
}

export default function StatsBar({ property }: StatsBarProps) {
  return (
    <View className='text-white bg-[#151515] border border-[#292929] rounded-xl px-8 py-4 mb-6 md:hidden'>
      <View className='flex items-center w-full gap-2 text-xs min-[300px]:text-sm 2xl:text-base'>
        <View className='space-y-1 grow'>
          <View className='flex items-center gap-1.5'>
            <Text className='text-[#FFBF75]'>★</Text>
            {property.rating ? (
              <Text>{property.rating}</Text>
            ) : (
              <Text className='text-[#A9A9A9]'>No rating yet</Text>
            )}
          </View>
          <View className={`${!property.region?.name && !property.region?.countryCode ? 'text-[#A9A9A9]' : ''} flex items-center gap-1.5`}>
            <MapPinFilledIcon className='size-4' />
            <Text>
              {formatPropertyRegion([property.region?.name, property.region?.countryCode])}
            </Text>
          </View>
        </View>
        
        <View className='space-y-1 '>
          {property.facts.roomsNumber && (
            <View className='flex items-center gap-1.5'>
              <PersonInBedIcon className='size-4' />
              <Text>{property.facts.roomsNumber} rooms</Text>
            </View>
          )}
          {property.facts.floorsNumber && (
            <View className='flex items-center gap-1.5'>
              <HouseFilledIcon className='size-4' />
              <Text>{property.facts.floorsNumber} floors</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
} 